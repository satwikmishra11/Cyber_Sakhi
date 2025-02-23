from dotenv import load_dotenv

import secrets

import json
import redis

from datetime import datetime
import requests

from pymongo import MongoClient

from flask_session import Session
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content

import cv2
import requests
import os


# 🎯 Max image size for resizing
MAX_SIZE = 600

# 📌 API Endpoint
API_URL = "https://api-us.faceplusplus.com/facepp/v3/compare"

def compare_faces(img1_url=None, img2_url=None, img1_path=None, img2_path=None):
    """
    Compare two faces from either URLs or local file paths using Face++ API.
    
    Parameters:
        img1_url (str): URL of the first image.
        img2_url (str): URL of the second image.
        img1_path (str): Local path of the first image.
        img2_path (str): Local path of the second image.

    Returns:
        bool: True if faces match (confidence > 75), otherwise False.
    """
    # 🖼️ Function to resize an image (for local files)
    def resize_image(image_path, output_path, max_size=MAX_SIZE):
        img = cv2.imread(image_path)
        if img is None:
            print(f"Error: Could not read {image_path}")
            return False
        h, w = img.shape[:2]

        if max(h, w) > max_size:
            scale = max_size / max(h, w)
            new_size = (int(w * scale), int(h * scale))
            resized_img = cv2.resize(img, new_size)
            cv2.imwrite(output_path, resized_img)
        else:
            cv2.imwrite(output_path, img)
        return True

    # 📤 Prepare API request
    files = {}
    data = {"api_key": API_KEY, "api_secret": API_SECRET}
    resized_images = []

    # 🌍 If using URLs, send image_url1 and image_url2
    if img1_url and img2_url:
        data["image_url1"] = img1_url
        data["image_url2"] = img2_url

    # 📁 If using local files, resize and send image_file1 and image_file2
    elif img1_path and img2_path:
        resized1, resized2 = "img1_resized.jpg", "img2_resized.jpg"

        if resize_image(img1_path, resized1) and resize_image(img2_path, resized2):
            files["image_file1"] = open(resized1, "rb")
            files["image_file2"] = open(resized2, "rb")
            resized_images.extend([resized1, resized2])
        else:
            print("Error: Could not resize images.")
            return False
    else:
        print("Error: Provide either image URLs or local file paths.")
        return False

    # 📡 Send API Request
    response = requests.post(API_URL, files=files, data=data)

    # 🔍 Try to parse JSON response
    try:
        json_response = response.json()
        confidence = json_response.get("confidence", 0)

        # 🧹 Close files if they were opened
        for f in files.values():
            f.close()

        # 🗑️ Delete resized images if they exist
        for img in resized_images:
            if os.path.exists(img):
                os.remove(img)

        # ✅ Return True if confidence > 75, else False
        return confidence > 75

    except requests.exceptions.JSONDecodeError:
        print("Failed to decode JSON. Possible API error.")
        return False




# Load environment variables
load_dotenv()


API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")

# Configure API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Define the model and response schema
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_schema": content.Schema(
        type=content.Type.OBJECT,
        properties={
            "category": content.Schema(type=content.Type.STRING),
            "probability": content.Schema(type=content.Type.NUMBER),
        },
    ),
    "response_mime_type": "application/json",
}

# Initialize Gemini model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=generation_config,
)



def categorize_posts(posts):
    """Categorizes posts one by one using Gemini AI with JSON schema enforcement."""
    if not posts:
        return {}

    categorized_posts = {}

    for post in posts:
        post_id = str(post["tweet"]["tweet_id"])
        post_text = post["tweet"]["tweet_content"]

        prompt = f"""
        Classify the following post into one of the categories:
        1. Harassment
        2. Threat
        3. Inappropriate
        4. Safe

        Post: "{post_text}"

        Respond strictly in JSON format:
        {{
            "category": "...",
            "probability": 0.0
        }}
        """

        try:
            # Start chat session
            chat_session = model.start_chat(
                history=[
                    {"role": "user", "parts": [prompt]},
                    {"role": "model", "parts": ["```json\n {\n  \"category\": \"Safe\",\n  \"probability\": 0.9\n}\n```"]},
                ]
            )

            # Send request to Gemini API
            response = chat_session.send_message(prompt)

        
            # Ensure response is not empty
            if not response.text.strip():
                raise ValueError("Received empty response from Gemini API")

            # Parse the JSON response
            response_data = json.loads(response.text)

            # Validate expected keys in response
            if "category" not in response_data or "probability" not in response_data:
                raise ValueError("Missing expected keys in Gemini response")

            # Store categorized post
            categorized_posts[post_id] = {
                "post_text": post_text,
                "category": response_data["category"],
                "probability": response_data["probability"],
            }

        except json.JSONDecodeError:
            categorized_posts[post_id] = {
                "post_text": post_text,
                "category": "Error",
                "probability": 0.0,
            }

        except Exception as e:
            categorized_posts[post_id] = {
                "post_text": post_text,
                "category": "Error",
                "probability": 0.0,
            }

    return categorized_posts


app = Flask(__name__, static_folder="../assets", template_folder="../frontend")

# App configuration
app_config = {
    "SECRET_KEY": os.getenv("SECRET_KEY"),  # Ensure a default value
    "TEMPLATES_AUTO_RELOAD": True,
    "SESSION_TYPE": "redis",
    "SESSION_REDIS": redis.from_url(os.getenv("REDIS_URI")),
    "SESSION_PERMANENT": False,
    "SESSION_USE_SIGNER": True,
    "SESSION_COOKIE_SECURE": os.getenv("FLASK_ENV", "production") == "production",
    "SESSION_COOKIE_SAMESITE": "Lax",
    "SESSION_COOKIE_NAME": "innovxchange-session",
    "SESSION_COOKIE_HTTPONLY": True,
}

# Apply configuration to the app
app.config.from_mapping(app_config)

# Initialize Flask-Session
Session(app)

# Initialize MongoDB client
MONGO_CLIENT = MongoClient(os.getenv("MONGODB_URI"))["cyber-skahi-prod"]


# Routes
@app.route("/")
def index():
    if session.get("user"):
        if MONGO_CLIENT["USERS"].find_one(
            {"user_id": session["user"]["user_id"], "account_info.social_profile": {"$exists": True}}
        ):
          return redirect(url_for("dashboard"))
        else:
          return render_template("index.html")
    return redirect(url_for("login"))

@app.route("/dashboard")
def dashboard():
    user = session.get("user")
    if not user:
        return redirect(url_for("login"))

    user_info = MONGO_CLIENT["USERS"].find_one({"user_id": user["user_id"]})
    if not user_info or "account_info" not in user_info or "social_profile" not in user_info["account_info"]:
        return redirect(url_for("login"))

    # Fetch posts mentioning the user
    # Fetch posts mentioning the user's username OR name

    user = user_info["account_info"]["social_profile"]

    all_posts = list(MongoClient(os.getenv("SOCIAL_MEDIA_MONGODB_URI"))["flutterbird"]["posts"].find({
        "$or": [
            {"tweet.tweet_content": {"$regex": f"@{user['user_name']}", "$options": "i"}},
            {"tweet.tweet_content": {"$regex": f"{user['profile']['name']}", "$options": "i"}},
            {"tweet.tweet_content": {"$regex": f"{user['profile']['name'].split()[0]}", "$options": "i"}},
        ]
    }, {"_id": 0, "tweet.tweet_id": 1, "tweet.tweet_content": 1}))

    print(all_posts)


    # Process posts with Gemini Flash 2.0
    categorized_posts = categorize_posts(all_posts)

    # Add post user info
    for post_id, post in categorized_posts.items():
        user_info = MongoClient(os.getenv("SOCIAL_MEDIA_MONGODB_URI"))["flutterbird"]["posts"].find_one(
            {"tweet.tweet_id": post_id}, {"_id": 0, "user": 1}
        )

        if user_info:
            post["user"] = user_info["user"]

    
    photos_collection = MongoClient(os.getenv("SOCIAL_MEDIA_MONGODB_URI"))["flutterbird"]["posts"]

    all_pictures = list(photos_collection.find({}, {"_id": 0, "tweet.tweet_id": 1, "tweet.tweet_media": 1}))

    # Filter posts with media
    posts_with_media = [post for post in all_pictures if len(post["tweet"].get("tweet_media", [])) > 0]

    # Dictionary to store matched posts
    image_categorized_posts = {}

    # Iterate through posts with media
    for post in posts_with_media:
        tweet_id = post["tweet"]["tweet_id"]
        media_urls = post["tweet"]["tweet_media"]
        
        for media_url in media_urls:
            if compare_faces(img1_url=user["profile"]["profile_picture_url"], img2_url=media_url):
                image_categorized_posts[tweet_id] = {"tweet_media": media_urls}
                break  # Stop checking once a match is found

    # Fetch user details and update categorized posts
    for post_id in image_categorized_posts.keys():
        user_info = photos_collection.find_one({"tweet.tweet_id": post_id}, {"_id": 0, "user": 1})
        
        if user_info:
            image_categorized_posts[post_id]["user"] = user_info["user"]

    print(image_categorized_posts)

    return render_template("dashboard.html", user_info=user_info, categorized_posts=categorized_posts, username=user["user_name"], total_posts=MongoClient(os.getenv("SOCIAL_MEDIA_MONGODB_URI"))["flutterbird"]["posts"].count_documents({}), total_identified_posts=len(categorized_posts), total_image_posts=len(image_categorized_posts), image_categorized_posts=image_categorized_posts)


# Authentication routes
@app.route("/auth/sign-in", methods=["GET"])
def login():
    session["auth_state"] = secrets.token_hex(16)
    return redirect(f'https://accounts.om-mishra.com/api/v1/oauth2/authorize?client_id=142decc8-6147-40d5-b5d7-3f2bec416c0a&state={session["auth_state"]}')

@app.route("/auth/sign-out", methods=["GET"])
def logout():
    session.clear()
    return redirect(url_for("index"))

@app.route("/oauth/_handler", methods=["GET"])
def callback():
    code = request.args.get("code")
    if not code:
        return redirect(
            url_for(
                "index",
                message="The authentication attempt failed, due to missing code parameter!",
            )
        )

    if request.args.get("state") != session.get("auth_state"):
        return redirect(
            url_for(
                "index",
                message="The authentication attempt failed, due to mismatched state parameter!",
            )
        )

    oauth_response = requests.post(
        "https://accounts.om-mishra.com/api/v1/oauth2/user-info",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        json={
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "code": code,
        },
    )

    if oauth_response.status_code != 200:
        return redirect(
            url_for(
                "index",
                message="The authentication attempt failed, due to invalid response from GitHub!",
            )
        )
        
    user_data = oauth_response.json()["user"]

    if (
        MONGO_CLIENT["USERS"].find_one({"account_info.oauth_id": user_data["user_public_id"]}) is None
    ):
        MONGO_CLIENT["USERS"].insert_one(
            {
                "user_id": user_data["user_public_id"],
                "user_info": {
                    "username": user_data["user_profile"]["user_name"],
                    "name": user_data["user_profile"]["user_display_name"],
                    "avatar_url": user_data["user_profile"]["user_profile_picture"],
                },
                "account_info": {
                    "oauth_provider": "om-mishra",
                    "oauth_id": user_data["user_public_id"],
                    "created_at": datetime.now(),
                    "last_login": datetime.now(),
                    "is_active": True,
                },
            }
        )
    else:
        user_id = MONGO_CLIENT["USERS"].find_one(
            {"account_info.oauth_id": user_data["user_public_id"]}
        )["user_id"]

        MONGO_CLIENT["USERS"].update_one(
            {"account_info.oauth_id": user_data["user_public_id"]},
            {"$set": {"account_info.last_login": datetime.now(), "user_info.avatar_url": user_data["user_profile"]["user_profile_picture"]}},
        )

    user_info = MONGO_CLIENT["USERS"].find_one({"user_id": user_data["user_public_id"]})

    session["user"] = {
        "user_id": user_info["user_id"],
        "username": user_info["user_info"]["username"],
        "name": user_info["user_info"]["name"],
        "avatar_url": f"{user_info['user_info']['avatar_url']}",
    }

    return redirect(url_for("index"))


# API routes

@app.route("/api/v1/check-profile", methods=["POST"])
def check_profile():
    account_username = request.json.get("profile").strip().replace("@", "")

    user_profile = MongoClient(os.getenv("SOCIAL_MEDIA_MONGODB_URI"))["flutterbird"]["users"].find_one(
        {"user_name": account_username}, {"_id": 0}
    )


    if user_profile is None:
        return jsonify({"status": "error", "message": "The user profile does not exist, please check the username!"})
    
    MONGO_CLIENT["USERS"].update_one(
        {"user_id": session["user"]["user_id"]},
        {"$set": {"account_info.social_profile": user_profile}},
    )

    return jsonify({"status": "success", "message": "The user profile has been successfully linked!"})

if __name__ == "__main__":
    app.run(debug=True)
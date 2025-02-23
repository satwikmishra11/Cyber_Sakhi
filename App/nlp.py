import random
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

class FakeNLPModel:
    def __init__(self):
        """Initializes a fake NLP model using TF-IDF vectorization and Logistic Regression"""
        self.categories = ["Harassment", "Threat", "Inappropriate", "Safe"]
        
        # Fake training data with predefined labels
        self.training_data = [
            ("You are so dumb", "Harassment"),
            ("I will kill you", "Threat"),
            ("This is offensive", "Inappropriate"),
            ("Have a great day!", "Safe"),
            ("Let's beat him up", "Threat"),
            ("You are ugly", "Harassment"),
            ("That was a racist comment", "Inappropriate"),
            ("Good work!", "Safe"),
        ]
        
        self.vectorizer = TfidfVectorizer()
        self.classifier = LogisticRegression()
        
        # Train the fake model
        self._train_model()
    
    def _train_model(self):
        """Pretend to train a logistic regression classifier"""
        texts, labels = zip(*self.training_data)
        X_train = self.vectorizer.fit_transform(texts)
        
        # Fake label encoding
        label_map = {cat: idx for idx, cat in enumerate(self.categories)}
        y_train = np.array([label_map[label] for label in labels])
        
        # Train the fake classifier
        self.classifier.fit(X_train, y_train)

    def predict(self, text):
        """Predicts the category of a given text"""
        X_test = self.vectorizer.transform([text])
        
        # Get fake prediction (randomly weighted)
        predicted_label_idx = self.classifier.predict(X_test)[0]
        predicted_category = self.categories[predicted_label_idx]
        
        # Assign random probability score
        probability = round(random.uniform(0.7, 1.0), 2)
        
        return {
            "category": predicted_category,
            "probability": probability
        }


# Categorization function using the fake model
def categorize_posts(posts):
    """Categorizes posts using the FakeNLPModel"""
    if not posts:
        return {}

    nlp_model = FakeNLPModel()
    categorized_posts = {}

    for post in posts:
        post_id = str(post["tweet"]["tweet_id"])
        post_text = post["tweet"]["tweet_content"]

        # Get fake prediction
        result = nlp_model.predict(post_text)

        # Store categorized post
        categorized_posts[post_id] = {
            "post_text": post_text,
            "category": result["category"],
            "probability": result["probability"]
        }

    return categorized_posts

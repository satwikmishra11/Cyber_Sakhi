document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".submit-btn");
    const inputField = document.querySelector("#social-profile");

    submitButton.addEventListener("click", function () {
        const userProfile = inputField.value.trim();

        if (!userProfile) {
            alert("Please enter a social media profile!");
            return;
        }

        showLoadingScreen();

        setTimeout(() => {
            hideLoadingScreen();
            callAPI(userProfile);
        }, 10000); // Increased to 10 seconds for better experience
    });
});

function showLoadingScreen() {
    const safetyFacts = [
        "95% of cyber harassment cases go unreported. Stay aware!",
        "Over 60% of women experience online abuse before age 25.",
        "Your personal data can be used to impersonate you. Be cautious!",
        "Cyberstalking is a crime. Know your digital rights!",
        "1 in 3 social media users face digital threats daily.",
        "Online blackmail cases have increased by 300% in the last five years.",
        "Using two-factor authentication reduces hacking risks by 99%!",
        "Never share personal details on public platforms.",
        "Blocking and reporting harassers can prevent further cyber threats.",
        "AI-powered tools like Cyber Sakhi can help protect your digital identity."
    ];

    const loadingScreen = document.createElement("div");
    loadingScreen.classList.add("loading-screen");
    document.body.appendChild(loadingScreen);

    let factIndex = 0;
    const factElement = document.createElement("p");
    factElement.classList.add("loading-message");
    loadingScreen.appendChild(factElement);

    function updateFact() {
        factElement.textContent = safetyFacts[factIndex];
        factIndex = (factIndex + 1) % safetyFacts.length;
    }

    updateFact();
    const factInterval = setInterval(updateFact, 2000); // Changing every 2 seconds

    loadingScreen.dataset.intervalId = factInterval;
}

function hideLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen) {
        clearInterval(loadingScreen.dataset.intervalId);
        document.body.removeChild(loadingScreen);
    }
}

function callAPI(userProfile) {
    fetch("api/v1/check-profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile: userProfile }),
    })
    .then(response => response.json())
        .then(data => {
        console.log(data);
        if (data.status === "success") {
            window.location.href = `/dashboard?profile=${userProfile}`;
        } else {
            alert(data.message);
            console.error(data);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while checking the profile. Please try again later."); 
    });
}

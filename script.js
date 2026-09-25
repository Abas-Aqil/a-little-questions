
"use strict";

/*
 * ==========================================
 * A LITTLE QUESTION ❤️
 * ==========================================
 *
 * This version sends the form answers to:
 *
 * 1. Your private Google Sheet
 * 2. Your WhatsApp number
 *
 * The Google Sheet itself remains private.
 * ==========================================
 */


/* ==========================================
   CONFIGURATION
========================================== */

const WHATSAPP_NUMBER = "252615820767";

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyRsSsDjN7Fsc2dqpH9V-t3Kc_pmHthxHllneIIzNJ7wXGjBPvwmY7Gk58An5RSftWSNQ/exec";


/* ==========================================
   ELEMENTS
========================================== */

const screens = document.querySelectorAll(".screen");

const nextButtons = document.querySelectorAll(".next-btn");

const yesButton = document.getElementById("yes-btn");
const noButton = document.getElementById("no-btn");
const answerArea = document.getElementById("answer-area");
const noStatus = document.getElementById("no-status");
const honestDecline = document.getElementById("honest-decline");

const form = document.getElementById("date-form");
const submitButton = document.getElementById("submit-btn");
const formStatus = document.getElementById("form-status");

const otherTimeRadio = document.getElementById("other-time-radio");
const otherTimeWrapper = document.getElementById("other-time-wrapper");
const otherTimeInput = document.getElementById("other-time");

const psButton = document.getElementById("ps-btn");
const psMessage = document.getElementById("ps-message");

const dateInput = document.getElementById("date");


/* ==========================================
   STATE
========================================== */

let noAttempts = 0;

const noMessages = [
    "Nice try 😂",
    "That button is a little shy.",
    "You really tried that? 👀",
    "Okay okay… I see you 😂"
];


/* ==========================================
   SCREEN NAVIGATION
========================================== */

function showScreen(screenNumber) {
    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const targetScreen =
        document.getElementById(`screen-${screenNumber}`);

    if (!targetScreen) {
        return;
    }

    targetScreen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior:
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
    });

    const heading = targetScreen.querySelector("h1, h2");

    if (heading) {
        heading.setAttribute("tabindex", "-1");

        heading.focus({
            preventScroll: true
        });
    }
}


/* ==========================================
   NEXT BUTTONS
========================================== */

nextButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const nextScreen = button.dataset.next;

        if (nextScreen) {
            showScreen(nextScreen);
        }
    });
});


/* ==========================================
   DECLINE
========================================== */

function handleNo() {
    showScreen("decline");
}

honestDecline.addEventListener("click", (event) => {
    event.preventDefault();
    handleNo();
});


/* ==========================================
   NO BUTTON
========================================== */

function moveNoButton() {
    if (noAttempts >= 5) {
        return;
    }

    const containerWidth = answerArea.clientWidth;
    const containerHeight = answerArea.clientHeight;

    const buttonWidth = noButton.offsetWidth;
    const buttonHeight = noButton.offsetHeight;

    const availableX =
        Math.max(0, containerWidth - buttonWidth);

    const availableY =
        Math.max(0, containerHeight - buttonHeight);

    /*
     * Keep movement playful and small.
     * The real measured dimensions are used.
     */
    const movementX =
        Math.min(availableX, 90);

    const movementY =
        Math.min(availableY, 50);

    const x =
        (Math.random() * movementX) -
        movementX / 2;

    const y =
        (Math.random() * movementY) -
        movementY / 2;

    noButton.style.transform =
        `translate(${x}px, ${y}px)`;

    noButton.classList.remove("no-moving");

    void noButton.offsetWidth;

    noButton.classList.add("no-moving");
}


function handleNoAttempt(event) {
    if (noAttempts >= 5) {
        return;
    }

    event.preventDefault();

    noAttempts++;

    const messageIndex =
        Math.min(
            noAttempts - 1,
            noMessages.length - 1
        );

    noStatus.textContent =
        noMessages[messageIndex];

    if (noAttempts >= 5) {
        noButton.textContent =
            "NO — it's okay";

        noButton.setAttribute(
            "aria-label",
            "No, it's okay"
        );

        noButton.style.transform =
            "translate(0, 0)";

        noStatus.textContent =
            "Okay. This one is staying right here. ❤️";

        return;
    }

    moveNoButton();
}


/* ==========================================
   NO BUTTON ACCESSIBILITY
========================================== */

noButton.addEventListener(
    "pointerdown",
    handleNoAttempt
);

noButton.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        event.preventDefault();

        if (noAttempts >= 5) {
            handleNo();
            return;
        }

        handleNoAttempt(event);
    }
);

noButton.addEventListener(
    "click",
    () => {
        if (noAttempts >= 5) {
            handleNo();
        }
    }
);


/* ==========================================
   YES
========================================== */

function handleYes() {
    showScreen("4");
}

yesButton.addEventListener(
    "click",
    handleYes
);


/* ==========================================
   DATE
========================================== */

function setMinimumDate() {
    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    dateInput.min =
        `${year}-${month}-${day}`;
}

setMinimumDate();


/* ==========================================
   OTHER TIME
========================================== */

document
    .querySelectorAll('input[name="startTime"]')
    .forEach((radio) => {

        radio.addEventListener(
            "change",
            () => {

                if (otherTimeRadio.checked) {

                    otherTimeWrapper.hidden =
                        false;

                    otherTimeInput.focus();

                } else {

                    otherTimeWrapper.hidden =
                        true;

                    otherTimeInput.value =
                        "";
                }
            }
        );
    });


/* ==========================================
   VALIDATION
========================================== */

function showFieldError(
    groupId,
    errorId,
    message
) {
    const group =
        document.getElementById(groupId);

    const error =
        document.getElementById(errorId);

    group.classList.add("has-error");

    error.textContent =
        message;
}


function clearFieldError(
    groupId,
    errorId
) {
    const group =
        document.getElementById(groupId);

    const error =
        document.getElementById(errorId);

    group.classList.remove("has-error");

    error.textContent =
        "";
}


function validateForm() {

    let isValid = true;

    clearFieldError(
        "name-group",
        "name-error"
    );

    clearFieldError(
        "date-group",
        "date-error"
    );

    clearFieldError(
        "time-group",
        "time-error"
    );

    clearFieldError(
        "duration-group",
        "duration-error"
    );

    clearFieldError(
        "activities-group",
        "activities-error"
    );


    const name =
        document
            .getElementById("name")
            .value
            .trim();


    const date =
        dateInput.value;


    const selectedTime =
        document.querySelector(
            'input[name="startTime"]:checked'
        );


    const selectedDuration =
        document.querySelector(
            'input[name="duration"]:checked'
        );


    const selectedActivities =
        document.querySelectorAll(
            'input[name="activities"]:checked'
        );


    /* NAME */

    if (!name) {

        showFieldError(
            "name-group",
            "name-error",
            "Please tell me what I should call you."
        );

        isValid = false;
    }


    /* DATE */

    if (!date) {

        showFieldError(
            "date-group",
            "date-error",
            "Please choose a date."
        );

        isValid = false;

    } else if (date < dateInput.min) {

        showFieldError(
            "date-group",
            "date-error",
            "Please choose a future date."
        );

        isValid = false;
    }


    /* TIME */

    if (!selectedTime) {

        showFieldError(
            "time-group",
            "time-error",
            "Please choose a start time."
        );

        isValid = false;

    } else if (
        selectedTime.value === "Other" &&
        !otherTimeInput.value.trim()
    ) {

        showFieldError(
            "time-group",
            "time-error",
            "Please tell me what time works for you."
        );

        isValid = false;
    }


    /* DURATION */

    if (!selectedDuration) {

        showFieldError(
            "duration-group",
            "duration-error",
            "Please choose how long you'd like to stay."
        );

        isValid = false;
    }


    /* ACTIVITIES */

    if (selectedActivities.length === 0) {

        showFieldError(
            "activities-group",
            "activities-error",
            "Please choose at least one thing you'd enjoy."
        );

        isValid = false;
    }


    return isValid;
}


/* ==========================================
   COLLECT FORM DATA
========================================== */

function collectFormData() {

    const selectedTime =
        document.querySelector(
            'input[name="startTime"]:checked'
        );


    const selectedDuration =
        document.querySelector(
            'input[name="duration"]:checked'
        );


    const selectedActivities =
        Array.from(
            document.querySelectorAll(
                'input[name="activities"]:checked'
            )
        ).map(
            (checkbox) => checkbox.value
        );


    let startTime =
        selectedTime
            ? selectedTime.value
            : "";


    if (startTime === "Other") {
        startTime =
            otherTimeInput.value.trim();
    }


    return {

        name:
            document
                .getElementById("name")
                .value
                .trim(),

        date:
            dateInput.value,

        startTime,

        duration:
            selectedDuration
                ? selectedDuration.value
                : "",

        activities:
            selectedActivities,

        avoid:
            document
                .getElementById("avoid")
                .value
                .trim(),

        message:
            document
                .getElementById("message")
                .value
                .trim()
    };
}


/* ==========================================
   FORMAT DATE
========================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    return new Intl.DateTimeFormat(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    ).format(date);
}


/* ==========================================
   WHATSAPP MESSAGE
========================================== */

function buildWhatsAppMessage(data) {

    const activities =
        data.activities
            .map(
                (activity) =>
                    `• ${activity}`
            )
            .join("\n");


    return `Hey ❤️

I filled out the little date plan.

Name: ${data.name}

📅 Date:
${formatDate(data.date)}

🌙 Start time:
${data.startTime}

⏳ Duration:
${data.duration}

What I'd enjoy:
${activities}

Anything I'd prefer to avoid:
${data.avoid || "Nothing specific"}

Anything else:
${data.message || "Nothing else"}

Looking forward to it. ❤️`;
}


/* ==========================================
   SAVE TO PRIVATE GOOGLE SHEET
========================================== */

/*
 * Google Apps Script accepts the JSON POST.
 *
 * "no-cors" is intentional here because the Google
 * Apps Script endpoint does not need to return data
 * to the browser. It only needs to receive the answers.
 *
 * We do NOT wait for this request before opening
 * WhatsApp.
 */

function saveToGoogleSheet(data) {

    const payload = {

        name: data.name,

        date: data.date,

        startTime: data.startTime,

        duration: data.duration,

        activities: data.activities.join(", "),

        avoid: data.avoid,

        message: data.message
    };


    try {

        fetch(
            GOOGLE_SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(payload),

                keepalive: true
            }
        ).catch(() => {
            /*
             * Do not interrupt the experience.
             *
             * WhatsApp is already being opened
             * independently.
             */
        });

    } catch (error) {
        /*
         * Do not show a generic error to her.
         */
    }
}


/* ==========================================
   SEND EVERYTHING
========================================== */

function sendFormData(data) {

    const message =
        buildWhatsAppMessage(data);


    const whatsappUrl =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    /*
     * IMPORTANT:
     *
     * WhatsApp is opened synchronously FIRST.
     *
     * No await.
     * No fetch before this.
     * No setTimeout.
     * No asynchronous operation.
     *
     * This helps mobile browsers allow the popup.
     */

    window.open(
        whatsappUrl,
        "_blank",
        "noopener"
    );


    /*
     * Save a copy to your private Google Sheet.
     *
     * This happens after window.open.
     */
    saveToGoogleSheet(data);


    /*
     * Show the success screen.
     */
    showScreen("6");
}


/* ==========================================
   FORM SUBMISSION
========================================== */

form.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        formStatus.textContent = "";


        if (!validateForm()) {

            formStatus.textContent =
                "Almost there — please check the highlighted fields.";

            const firstError =
                form.querySelector(
                    ".has-error input, .has-error textarea"
                );

            if (firstError) {
                firstError.focus();
            }

            return;
        }


        /*
         * Prevent duplicate submissions.
         */
        submitButton.disabled =
            true;

        submitButton.textContent =
            "Opening WhatsApp…";


        const data =
            collectFormData();


        /*
         * WhatsApp opens synchronously.
         * Google Sheet saving happens afterward.
         */
        sendFormData(data);
    }
);


/* ==========================================
   P.S. REVEAL
========================================== */

psButton.addEventListener(
    "click",
    () => {

        const isOpen =
            psButton.getAttribute(
                "aria-expanded"
            ) === "true";


        psButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );


        if (isOpen) {

            psMessage.hidden =
                true;

            psButton.textContent =
                "Wait… there's one more thing 👀";

        } else {

            psMessage.hidden =
                false;

            psButton.textContent =
                "Okay, that's the last secret ❤️";


            psMessage.scrollIntoView({
                behavior:
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth",

                block: "nearest"
            });
        }
    }
);


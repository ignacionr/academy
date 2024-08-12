function convertUTCToLocalTime(utcTimeString) {
    const utcDate = new Date(utcTimeString);

    // Get the user's local date and time string with detailed options
    const options = {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        timeZoneName: 'long'
    };
    return utcDate.toLocaleString(base_locale, options);
}

const backend = "https://script.google.com/macros/s/AKfycbzK8tsPCVw_tSGSGaLKTwk6vLc1rma3ANAfqWt8TeqvO3g-9tnnAU1v9sYXEkQ4Ja-51g/exec?lang=" + base_locale;
const messages = {
    "es": {
        signup_button: "¡Inscríbete por un dólar!"
    },
    "en": {
        signup_button: "Sign up for a dollar!"
    }
};

fetch(backend)
    .then(response => response.json())
    .then(data => {
        const target_table = document.getElementById("all-classes");
        // go through each of the properties of the data object
        for (const [key, value] of Object.entries(data)) {
            const courseInfo = value.courseInfo;
            const events = value.events;
            // create the row for the course
            const course_row = document.createElement("tr");
            // create the cell for the course title
            const title_cell = document.createElement("td");
            title_cell.colSpan = 2;
            title_cell.innerHTML = `<h3>${courseInfo.icon}${courseInfo.title}</h3><p>${courseInfo.description}</p>`;
            course_row.appendChild(title_cell);
            target_table.appendChild(course_row);
            // create the cell for the course kata
            const kata_row = document.createElement("tr");
            const kata_cell = document.createElement("td");
            kata_cell.colSpan = 2;
            kata_cell.textContent = courseInfo.kata;
            kata_row.appendChild(kata_cell);
            // add the course row to the table
            target_table.appendChild(kata_row);
            // go through each of the events of the course
            for (const event of events) {
                // create the row for the event
                const event_row = document.createElement("tr");
                // create the cell for the event start time
                const startTime_cell = document.createElement("td");
                startTime_cell.textContent = convertUTCToLocalTime(event.startTime);
                event_row.appendChild(startTime_cell);
                // an anchor to register for the event
                const register_cell = document.createElement("td");
                const register_link = document.createElement("a");  
                register_link.href = event.register_href;
                register_link.classList.add("button");
                register_link.textContent = messages[base_locale].signup_button;
                register_cell.appendChild(register_link);
                event_row.appendChild(register_cell);
                target_table.appendChild(event_row);
            }
        }
    });

const suggestion_form = document.getElementById("suggestion-form");
suggestion_form.addEventListener("submit", function(event) {
    event.preventDefault();
    const contents = document.getElementById("suggestion-contents").value;
    const email = document.getElementById("suggestion-email").value;
    const suggested_datetime = document.getElementById("suggestion-time").value;
    const user_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const payload = {
        contents: contents,
        email: email,
        suggested_datetime: suggested_datetime,
        user_timezone: user_timezone
    };
    fetch(backend + "&op=suggestion", {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        suggestion_form.parentElement.innerText = data.message;
    });
});

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

const backend = "https://hook-forwarder.ignacio-c20.workers.dev/?lang=" + base_locale;

do_register = function(event_id) {
    fetch(backend + "&op=payment&event_id=" + event_id)
    .then(response => response.json())
    .then(data => {
        window.location.href = data.url;
    });
};

fetch(`${backend}&maxResults=15`)
    .then(response => response.json())
    .then(data => {
        const lessons_container = document.getElementById("lessons-container");
        // go through each of the properties of the data object
        for (const [key, value] of Object.entries(data)) {
            const target_table = document.createElement("table");
            target_table.classList.add("card");
            lessons_container.appendChild(target_table);
            const courseInfo = value.courseInfo;
            const events = value.events;
            // create the row for the course
            const course_row = document.createElement("tr");
            // create the cell for the course title
            const image_cell = document.createElement("th");
            image_cell.innerHTML = courseInfo.icon;
            course_row.appendChild(image_cell);
            const title_cell = document.createElement("th");
            title_cell.innerText = courseInfo.title;
            course_row.appendChild(title_cell);
            target_table.appendChild(course_row);
            const description_row = document.createElement("tr");
            const description_cell = document.createElement("td");
            description_cell.colSpan = 2;
            description_cell. innerText = courseInfo.description;
            description_row.appendChild(description_cell);
            target_table.appendChild(description_row);
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
                register_link.onclick = function() { do_register(event.id); };
                register_link.classList.add("button");
                register_link.classList.add(`schedule-${event.schedule}`);
                register_link.innerHTML = event.register_text;
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

document.addEventListener('DOMContentLoaded', function() {
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const carousel = document.querySelector('.carousel');

    function showArrows() {
        leftArrow.classList.remove('hidden');
        rightArrow.classList.remove('hidden');

        setTimeout(() => {
            leftArrow.classList.add('hidden');
            rightArrow.classList.add('hidden');
        }, 4000);  // Arrows fade after 4 seconds of inactivity
    }

    // Show arrows when the page loads
    showArrows();

    // Show arrows when user interacts with the carousel
    carousel.addEventListener('scroll', showArrows);

    // Optional: Add functionality to the arrows to scroll the carousel
    leftArrow.addEventListener('click', () => {
        carousel.scrollBy({
            left: -carousel.offsetWidth,
            behavior: 'smooth'
        });
    });

    rightArrow.addEventListener('click', () => {
        carousel.scrollBy({
            left: carousel.offsetWidth,
            behavior: 'smooth'
        });
    });
});

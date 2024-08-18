function convertUTCToLocalTime(utcTimeString, with_svg = false) {
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

    var svg = "";
    if (with_svg) {
        const month = utcDate.toLocaleString(base_locale, { month: 'short' });
        const day = utcDate.toLocaleString(base_locale, { day: 'numeric' });
        const weekday = utcDate.toLocaleString(base_locale, { weekday: 'short' });
        svg = `<svg width="50" height="50" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block; float:left; margin-right: 10px">
  <!-- Background rectangle -->
  <rect x="5" y="5" width="90" height="90" rx="10" ry="10" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>

  <!-- Top bar (month) -->
  <rect x="5" y="5" width="90" height="25" fill="#4A90E2"/>
  <text x="50" y="22" font-family="Arial" font-size="12" fill="white" text-anchor="middle">${month}</text>

  <!-- Weekday -->
  <text x="50" y="45" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">${weekday}</text>

  <!-- Date number -->
  <text x="50" y="75" font-family="Arial" font-size="30" fill="#333" text-anchor="middle">${day}</text>
</svg>&nbsp;`;
    }

    return svg + utcDate.toLocaleString(base_locale, options);
}

const backend = "https://hook-forwarder.ignacio-c20.workers.dev/?lang=" + base_locale;

var courses = null;

do_register = function(event_id) {
    fetch(backend + "&op=payment&event_id=" + event_id)
    .then(response => response.json())
    .then(data => {
        window.location.href = data.url;
    });
};

const translation = {
    "es": {
        "track": "Nivel "
    },
    "en": {
        "track": "Level "
    }
};

function create_course_card(key, value, lessons_container) {
    const target_table = document.createElement("table");
    target_table.id = key;
    target_table.classList.add("card");
    lessons_container.appendChild(target_table);
    const courseInfo = value.courseInfo;
    const events = value.events;
    // create the row for the course
    const course_row = document.createElement("tr");
    course_row.style.backgroundColor = courseInfo.schedule[2];
    // create the cell for the course title
    const image_cell = document.createElement("th");
    image_cell.innerHTML = courseInfo.icon;
    image_cell.classList.add("schedule-title");
    course_row.appendChild(image_cell);
    const title_cell = document.createElement("th");
    title_cell.innerText = courseInfo.title;
    title_cell.classList.add("schedule-title");
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
        startTime_cell.innerHTML = convertUTCToLocalTime(event.startTime, true);
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
    return target_table;
}

// catch hash changes
window.addEventListener("hashchange", function(event) {
    // prevent the default behavior
    event.preventDefault();
    const hash = window.location.hash;
    const course_key = hash.substring(1);
    // find if there is already a card for the course
    var course_card = document.getElementById(course_key);
    if (!course_card) {
        // if not, create the card
        const lessons_container = document.getElementById("lessons-container");
        // remove all the children of the lessons container
        lessons_container.innerHTML = "";
        course_card = create_course_card(course_key, courses[course_key], lessons_container);
    }
    // scroll to the course card
    course_card.scrollIntoView({ behavior: 'smooth' });
    // highlight the course card
    course_card.classList.add("highlight");
    setTimeout(function() {
        course_card.classList.remove("highlight");
    }, 3000);
});

function create_index_card(key, value, index_container) {
    const schedule = value[0].courseInfo.schedule;
    const color = schedule[2];
    const target_table = document.createElement("table");
    target_table.classList.add("card");
    target_table.style.borderColor = color;
    target_table.style.accentColor = color;
    index_container.appendChild(target_table);
    const schedule_row = document.createElement("tr");
    // create the cell for the course title
    const title_cell = document.createElement("th");
    title_cell.colSpan = 2;
    schedule_row.style.backgroundColor = color;
    schedule_row.appendChild(title_cell);
    title_cell.textContent = translation[base_locale].track + schedule[0];
    title_cell.classList.add("schedule-title");
    target_table.appendChild(schedule_row);
    // go through each of the events of the course
    for (const course of value) {
        // create the row for the event
        const anchor = document.createElement("a");
        anchor.href = `${base_locale}/#${course.key}`;
        const course_row = document.createElement("tr");
        course_row.style.borderColor = color;
        // create the cell for the event start time
        const title_cell = document.createElement("td");
        title_cell.textContent = course.courseInfo.title;
        course_row.appendChild(title_cell);
        const link_cell = document.createElement("td");
        const title_link = document.createElement("a");
        title_link.classList.add("button","grey");
        title_link.textContent = "📚";
        link_cell.appendChild(title_link);
        course_row.appendChild(link_cell);
        anchor.appendChild(course_row);
        target_table.appendChild(anchor);
    }
    return target_table;
}

fetch(`${backend}&maxResults=150`)
    .then(response => response.json())
    .then(data => {
        courses = data;
        // aggregate the courses by schedule (level)
        const by_schedule = Object.entries(data).reduce((acc, [key, value]) => {
            const schedule_key = value.courseInfo.schedule[0];
            if (!acc[schedule_key]) {
                acc[schedule_key] = [];
            }
            acc[schedule_key].push(Object.assign(value, { key: key }));
            return acc;
        }, {});
        for (const [key, value] of Object.entries(by_schedule)) {
            create_index_card(key, value, document.getElementById("index-container"));
        }
        // go through each of the properties of the data object
        // for (const [key, value] of Object.entries(data)) {
        //     create_course_card(key, value, lessons_container);
        // }
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

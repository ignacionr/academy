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
        // will look like this: {"A1":{"courseInfo":{"title":"Configuramos C++ en 20 minutos y primer programa","description":"Esta clase no es dif&iacute;cil, pero es muy importante. No necesit&aacute;s una gran computadora, basta que funcione el navegador. Sal&iacute;s compilando tu primer programa en C++.","kata":""},"events":[{"startTime":"2024-08-12T15:00:00-03:00","registered":0,"googleMeetUrl":"https://meet.google.com/tvn-wxgu-rtk"},{"startTime":"2024-08-12T18:00:00-03:00","registered":0,"googleMeetUrl":"https://meet.google.com/mah-gfdt-suv"},{"startTime":"2024-08-13T18:00:00-03:00","registered":0,"googleMeetUrl":"https://meet.google.com/mfw-stcv-ksc"},{"startTime":"2024-08-14T15:00:00-03:00","registered":0,"googleMeetUrl":"https://meet.google.com/kav-spmt-jwn"}]}}
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
            title_cell.innerHTML = `<h3>${courseInfo.title}</h3><p>${courseInfo.description}</p>`;
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
                register_link.href = "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=inz@fastmicroservices.com&amount=1.00&currency_code=USD&item_name=Lesson+Registration+Fee&custom=" + event.id;
                register_link.classList.add("button");
                register_link.textContent = messages[base_locale].signup_button;
                register_cell.appendChild(register_link);
                event_row.appendChild(register_cell);
                target_table.appendChild(event_row);
            }
        }
    });

function convertUTCToLocalTime() {
    const timeElements = document.querySelectorAll('.point_in_time');

    timeElements.forEach(element => {
        const utcTimeString = element.textContent;
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
        const localDateString = utcDate.toLocaleString(base_locale, options);

        // Update the element's content with the local date and time
        element.textContent = localDateString;
    });
}

// Convert UTC times to local times on page load
document.addEventListener('DOMContentLoaded', convertUTCToLocalTime);

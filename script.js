// Predefined habits
const predefinedHabits = ["Sit-ups", "Pull-ups", "Push-ups", "Dips"];

// Load habits data from localStorage or use default
let habitsData = JSON.parse(localStorage.getItem('habitsData')) || {
    "2023-10-01": { "Sit-ups": 30, "Pull-ups": 10, "Push-ups": 20, "Dips": 15 },
    "2023-10-02": { "Sit-ups": 25, "Pull-ups": 12, "Push-ups": 22, "Dips": 18 },
    // Add more dates and habits as needed
};

// Set the current date as default
const currentDate = new Date().toISOString().split('T')[0];
document.getElementById('view-date').value = currentDate;

// Function to display habits
function displayHabits() {
    const selectedDate = document.getElementById('view-date').value;
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = ''; // Clear the list

    predefinedHabits.forEach(exercise => {
        const listItem = document.createElement('li');
        listItem.className = 'bg-gray-700 p-4 rounded flex flex-col justify-between items-center';

        const count = habitsData[selectedDate] && habitsData[selectedDate][exercise] ? habitsData[selectedDate][exercise] : 0;
        listItem.innerHTML = `
            <div class="flex items-center w-full justify-between">
                <span class="text-lg">${exercise}: </span>
                <input type="number" value="${count}" class="w-16 text-center border border-gray-600 rounded-md bg-gray-800 text-white mx-2" disabled>
                ${selectedDate === currentDate ? `
                <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded" data-change="clear">Clear</button>
                ` : ''}
            </div>
            ${selectedDate === currentDate ? `
            <div class="flex space-x-1 mt-2">
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-change="1">+1</button>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-change="2">+2</button>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-change="5">+5</button>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded" data-change="10">+10</button>
            </div>
            <div class="flex space-x-1 mt-2">
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-change="-1">-1</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-change="-2">-2</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-change="-5">-5</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-change="-10">-10</button>
            </div>
            ` : ''}
        `;
        habitList.appendChild(listItem);

        // Add event listeners for add, remove, and clear buttons
        if (selectedDate === currentDate) {
            listItem.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', function() {
                    const change = this.getAttribute('data-change');
                    if (change === "clear") {
                        updateHabitCount(exercise, -count); // Set to 0
                    } else {
                        updateHabitCount(exercise, parseInt(change, 10));
                    }
                });
            });
        }
    });
}

// Function to update habit count
function updateHabitCount(exercise, change) {
    const selectedDate = document.getElementById('view-date').value;
    if (!habitsData[selectedDate]) {
        habitsData[selectedDate] = {};
    }
    const newCount = (habitsData[selectedDate][exercise] || 0) + change;
    habitsData[selectedDate][exercise] = Math.max(newCount, 0); // Ensure count doesn't go below 0
    localStorage.setItem('habitsData', JSON.stringify(habitsData));
    displayHabits(); // Refresh the display
}

// Display habits on page load
displayHabits();

// Update habits display when the date changes
document.getElementById('view-date').addEventListener('change', displayHabits);

// Initialize Flatpickr
flatpickr("#view-date", {
    dateFormat: "Y-m-d",
    wrap: true,
    allowInput: true,
    onChange: function(selectedDates, dateStr, instance) {
        displayHabits(); // Refresh habits when date changes
    }
});
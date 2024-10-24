document.addEventListener('DOMContentLoaded', () => {
    const timetableTableBody = document.querySelector('#timetable tbody');
    const addEntryBtn = document.querySelector('#addEntryBtn');
    const entryForm = document.querySelector('#entryForm');
    const form = document.querySelector('#form');
    const cancelBtn = document.querySelector('#cancelBtn');
    let editIndex = null;

    addEntryBtn.addEventListener('click', () => {
        form.reset();
        entryForm.classList.remove('hidden');
        editIndex = null;
    });

    cancelBtn.addEventListener('click', () => {
        entryForm.classList.add('hidden');
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = {
            time: formData.get('time'),
            monday: formData.get('monday'),
            tuesday: formData.get('tuesday'),
            wednesday: formData.get('wednesday'),
            thursday: formData.get('thursday'),
            friday: formData.get('friday')
        };

        if (editIndex !== null) {
            await fetch(`/update/${editIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            await fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        loadTimetable();
        entryForm.classList.add('hidden');
    });

    async function loadTimetable() {
        const response = await fetch('/timetable');
        const timetable = await response.json();
        timetableTableBody.innerHTML = '';
        timetable.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.time}</td>
                <td>${entry.monday}</td>
                <td>${entry.tuesday}</td>
                <td>${entry.wednesday}</td>
                <td>${entry.thursday}</td>
                <td>${entry.friday}</td>
                <td>
                    <button onclick="editEntry(${index})">Edit</button>
                    <button onclick="deleteEntry(${index})">Delete</button>
                </td>
            `;
            timetableTableBody.appendChild(row);
        });
    }

    window.editEntry = async (index) => {
        const response = await fetch(`/timetable/${index}`);
        const entry = await response.json();
        form.time.value = entry.time;
        form.monday.value = entry.monday;
        form.tuesday.value = entry.tuesday;
        form.wednesday.value = entry.wednesday;
        form.thursday.value = entry.thursday;
        form.friday.value = entry.friday;
        editIndex = index;
        entryForm.classList.remove('hidden');
    };

    window.deleteEntry = async (index) => {
        await fetch(`/delete/${index}`, { method: 'DELETE' });
        loadTimetable();
    };

    loadTimetable();
});


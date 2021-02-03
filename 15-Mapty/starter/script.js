'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// prebind this
class App
{
    #map;
    #mapEvent;
    #workouts = [];
    constructor()
    {
        // bind all method to the new created object;
        this._newWorkout = this._newWorkout.bind(this);
        this._loadMap = this._loadMap.bind(this);
        this._showForm = this._showForm.bind(this);
        this._toggleElevationField = this._toggleElevationField.bind(this);
        this._moveToPopup = this._moveToPopup.bind(this);

        this._init();
    }

    _init()
    {
        this._getPosition();
        this._getLocalStorage();
        form
            .addEventListener("submit", this._newWorkout);
        inputType
            .addEventListener("change", this._toggleElevationField);
        containerWorkouts
            .addEventListener("click", this._moveToPopup);
    }

    _getLocalStorage()
    {
        const data = JSON.parse(localStorage.getItem("workouts"));
        if (!data) return;
        this.#workouts = data;
        this.#workouts
            .forEach(workout =>
            {
                this._renderWorkout(workout);

            });
    }

    _setLocalStorage()
    {
        localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }

    _moveToPopup(e)
    {
        const id = e.target.closest(".workout")?.dataset.id;
        if (!id) return;

        const workout = this.#workouts.find(work => work.id === id);
        const { lat, lng } = workout;
        this.#map.setView([lat, lng], 13, { animate: true, pan: { duration: 1 } },);
    }

    _getPosition()
    {
        navigator.geolocation?.getCurrentPosition
            (
                this._loadMap,
                function () { console.log("Could not get your location."); }
            );
    }

    _loadMap(position)
    {
        const { latitude, longitude } = position.coords;

        this.#map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        // handle click on map
        this.#map.on("click", this._showForm
        );

        this.#workouts.forEach(workout => this._renderWorkoutMarker(workout));

    }
    _showForm(mapE)
    {
        this.#mapEvent = mapE;
        form.classList.remove("hidden");
        inputDistance.focus();
    }
    _hideForm()
    {
        form.style.display = "none";
        form.classList.add("hidden");
        setTimeout(function () { form.style.display = "grid"; }, 0);

    }
    _resetForm()
    {
        inputCadence.value = "";
        inputDistance.value = "";
        inputDuration.value = "";
        inputElevation.value = "";
    }
    _toggleElevationField()
    {

        inputElevation.parentElement.classList.toggle("form__row--hidden");
        inputCadence.parentElement.classList.toggle("form__row--hidden");

    }

    _renderWorkoutMarker(workout)
    {
        L.marker([workout.lat, workout.lng])
            .addTo(this.#map)
            .bindPopup
            (
                L.popup
                    ({
                        maxWidth: 200,
                        minWidth: 100,
                        autoClose: false,
                        closeOnClick: false,
                        className: `${ workout.type }-popup`,
                    })
            )
            .setPopupContent(`${ workout.type }`)
            .openPopup();
    }

    _renderWorkout(workout)
    {
        const html = `
            <li class="workout workout--${ workout.type }" data-id="${ workout.id }">
              <h2 class="workout__title" style="text-transform: capitalize;">
                ${ workout.type } on ${ new Intl.DateTimeFormat("en-Us", { month: "long", day: "numeric" }).format(this.date) }
              </h2>
              <div class="workout__details">
                <span class="workout__icon">
                    ${ workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️" }
                </span>
                <span class="workout__value">${ workout.distance }</span>
                <span class="workout__unit">km</span>
              </div >
              <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${ workout.duration }</span>
                <span class="workout__unit">min</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">
                  ${ workout.type === "running" ? workout.pace : workout.speed }
                </span>
                <span class="workout__unit">
                    ${ workout.type === "running" ? "min/km" : "km/h" }
                </span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">
                    ${ workout.type === "running" ? "🦶🏼" : "⛰" }
                </span>
                <span class="workout__value">
                    ${ workout.type === "running" ? workout.cadence : workout.elevation }
                </span>
                <span class="workout__unit">
                ${ workout.type === "running" ? "spm" : "m" }
                </span>
              </div>
            </li>
        `;



        form.insertAdjacentHTML("afterend", html);

    };



    _newWorkout(e)
    {
        e.preventDefault();
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { latlng: { lat, lng } } = this.#mapEvent;
        let workout = [];

        function areAllNumber(...args)
        {
            return args.every(arg => Number.isFinite(arg));
        }
        function areAllPositive(...args)
        {
            return args.every(arg => arg > 0);
        }


        if (type === "running")
        {

            const cadence = +inputCadence.value;

            if ( /* check is number */
                !areAllNumber(distance, duration, cadence) ||
                !areAllPositive(distance, duration, cadence)
            ) return alert("input should be a positive number.");

            workout
                = new Running([lat, lng], distance, duration, cadence);

        }

        if (type === "cycling")
        {
            const elevation = +inputElevation.value;

            if ( /* check is number */
                !areAllNumber(distance, duration, elevation) ||
                !areAllPositive(distance, duration)
            ) return alert("input should be a positive number.");

            workout =
                new Cycling([lat, lng], distance, duration, elevation);
        }


        this.#workouts.push(workout);

        this._resetForm();

        this._renderWorkoutMarker(workout);
        this._renderWorkout(workout);
        this._hideForm();

        this._setLocalStorage();
    }

    reset()
    {
        localStorage.removeItem("workouts");
        location.reload();
    }
}

class Workout
{
    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor([lat, lng], distance, duration)
    {
        [this.lat, this.lng] = [lat, lng];
        this.distance = distance;/* km */
        this.duration = duration;/* min */
    };
}

class Running extends Workout
{
    type = "running";
    constructor([lat, lng], distance, duration, cadence)
    {
        super([lat, lng], distance, duration);
        this.cadence = cadence;
        this.calPace();
    }
    calPace()
    {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}
class Cycling extends Workout
{
    type = "cycling";
    constructor([lat, lng], distance, duration, elevation)
    {
        super([lat, lng], distance, duration);
        this.elevation = elevation;
        this.calSpeed();
    }
    calSpeed()
    {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

const app = new App();







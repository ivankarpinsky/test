window.onload = function () {
    const TICKET_PRICE = 700;
    const DOUBLE_TICKET_PRICE = 1200;
    const TRIP_DURATION = 50;
    const ROUTES = ['из A в B', 'из B в A', 'из A в B и обратно в A'];
    const BASE_START_TIMES = ['18:00', '18:30', '18:45', '19:00', '19:15', '21:00'];
    const BASE_BACK_TIMES = ['18:30', '18:45', '19:00', '19:15', '19:35', '21:50', '21:55'];
    const DATE_OFFSET = 4// -1 * (new Date().getTimezoneOffset() / 60) - 3;

    let startTimes = BASE_START_TIMES.map(getTimesWithOffset);
    let backTimes = BASE_BACK_TIMES.map(getTimesWithOffset);
    let startMinutes = BASE_START_TIMES.map(getMinutesWithOffset);
    let backMinutes = BASE_BACK_TIMES.map(getMinutesWithOffset);

    let route = document.getElementById('route');
    let time = document.getElementById('time');
    let backTime = document.getElementById('backTime');
    let numInput = document.getElementById('num');
    let button = document.getElementById('calculate');
    let routeType = parseInt(route.value);

    setSelectOptions((routeType === 1) ? backTimes : startTimes);

    button.addEventListener("click", () => {
        let cost = 0;
        let routeType = parseInt(route.value);
        let direction = ROUTES[routeType];
        let fullTripDuration = routeType === 2 ? TRIP_DURATION * 2 : TRIP_DURATION;
        let num = parseInt(numInput.value);
        let startTime = routeType === 1 ? backTimes[parseInt(time.value)] : startTimes[parseInt(time.value)];
        let startFinishedTime = getTimePlusTripDuration(startTime);

        let resultDiv = document.getElementById('result');

        if (!num || num<=0) {
            alert('Введите количество билетов');
            return;
        }

        cost = ((routeType === 2) ? DOUBLE_TICKET_PRICE : TICKET_PRICE) * num;

        if (routeType !== 2) {
            resultDiv.innerHTML = `Вы выбрали ${num} билета(-ов) по маршруту ${direction} стоимостью ${cost}р.<br/>
Это путешествие займет у вас ${fullTripDuration} минут.<br/>
Теплоход отправляется в ${startTime}, а прибудет в ${startFinishedTime} 
`;
        } else {
            let curBackTime = backTimes[parseInt(backTime.value)];
            let curBackFinishedTime = getTimePlusTripDuration(curBackTime);

            resultDiv.innerHTML = `Вы выбрали ${num} билета(-ов) по маршруту ${direction} стоимостью ${cost}р.<br/>
Это путешествие займет у вас ${fullTripDuration} минут.<br/>
Теплоход отправляется из пункта A в ${startTime}, прибудет в пункт B в ${startFinishedTime}.<br/>
Теплоход отправляется из пункта B в ${curBackTime}, а вернется в пункт A в ${curBackFinishedTime}.
`;
        }
    });

    route.addEventListener("change", (e) => {
        let hiddenDiv = document.querySelector('.backTimeHidden');
        let routeType = parseInt(e.target.value);

        setSelectOptions((routeType === 1) ? backTimes : startTimes);

        if (e.target.value === "2") {
            show(hiddenDiv);
            setBackTimeSelectOptions(startMinutes[0]);
        } else {
            hide(hiddenDiv);
        }
    })

    time.addEventListener("change", (e) => {
        if (route.value !== "2") return;

        let minutes = startMinutes[parseInt(e.target.value)];

        setBackTimeSelectOptions(minutes);
    })

    function setBackTimeSelectOptions(minutes) {
        backTime.innerHTML = '';

        for (let i = 0; i < backTimes.length; i++) {
            let curBackMinutes = backMinutes[i];

            if (curBackMinutes < (minutes + TRIP_DURATION)) continue;

            let option = document.createElement('option');
            option.innerText = `${backTimes[i]}`;
            option.value = String(i);
            backTime.appendChild(option);
        }
    }

    function setSelectOptions(times) {
        time.innerHTML = '';

        for (let i = 0; i < times.length; i++) {
            let option = document.createElement('option');
            option.innerText = `${times[i]}`;
            option.value = String(i);
            time.appendChild(option);
        }
    }

    function hide(element) {
        element.style.display = "none";
    }

    function show(element) {
        element.style.display = "block";
    }

    function getTimesWithOffset(el) {
        let splited = el.split(':');
        let hours = parseInt(splited[0]) + DATE_OFFSET;
        if (hours > 23) {
            hours -= 24;
        } else if (hours < 0) {
            hours += 24;
        }

        hours = hours < 10 ? "0" + hours : hours;

        return hours + ":" + splited[1];
    }

    function getTimePlusTripDuration(time) {
        let splited = time.split(':');
        let minutes = parseInt(splited[1]);
        let hours = parseInt(splited[0]) + Math.floor((TRIP_DURATION + minutes) / 60);
        minutes = (TRIP_DURATION + minutes) % 60;
        if (hours > 23) {
            hours -= 24;
        } else if (hours < 0) {
            hours += 24;
        }

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return hours + ":" + minutes;
    }

    function getMinutesWithOffset(el) {
        let splited = el.split(':');
        let hours = parseInt(splited[0]) + DATE_OFFSET;

        return hours * 60 + parseInt(splited[1])
    }
}
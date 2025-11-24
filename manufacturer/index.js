const circleContainer = document.querySelector(".circlecont");
const pillTemplate = document.getElementById("cap-template");

const getCapContainers = () => {
    if (!circleContainer) {
        return [];
    }
    return Array.from(circleContainer.querySelectorAll(".capcont"));
};

const getOrbitingCaps = () => getCapContainers().filter((cap) => !cap.classList.contains("last"));

const setCircularLayout = () => {
    const orbiters = getOrbitingCaps();
    if (!orbiters.length) {
        return;
    }

    const angleSlice = 360 / orbiters.length;
    orbiters.forEach((cap, index) => {
        const rotation = angleSlice * index;
        cap.style.transform = `rotate(${rotation}deg)`;
    });
};

const restartAnimations = (capContainer) => {
    if (!capContainer) {
        return;
    }
    const animatedParts = [
        capContainer.querySelector(".cap"),
        capContainer.querySelector(".topcont"),
        capContainer.querySelector(".botcont"),
    ];

    animatedParts.forEach((part) => {
        if (!part) {
            return;
        }
        part.style.animation = "none";
        void part.offsetWidth;
        part.style.animation = "";
    });
};

const activateCapElement = (target) => {
    if (!target) {
        return;
    }

    const caps = getCapContainers();
    caps.forEach((cap) => {
        if (cap === target) {
            cap.classList.add("last");
            cap.style.transform = "";
        } else {
            cap.classList.remove("last");
        }
    });

    restartAnimations(target);
};

const createCapElement = () => {
    if (!pillTemplate) {
        return null;
    }
    const fragment = pillTemplate.content.firstElementChild;
    if (!fragment) {
        return null;
    }
    return fragment.cloneNode(true);
};

const attachAnimationListener = (container) => {
    const cap = container.querySelector(".cap");
    if (!cap) {
        return;
    }
    cap.addEventListener("animationend", handleShipComplete);
};

const addNewCap = () => {
    if (!circleContainer) {
        return;
    }
    const newCap = createCapElement();
    if (!newCap) {
        return;
    }

    circleContainer.appendChild(newCap);
    attachAnimationListener(newCap);
    activateCapElement(newCap);
    setCircularLayout();
};

const handleShipComplete = (event) => {
    if (event.animationName !== "ship") {
        return;
    }
    addNewCap();
};

const attachInitialListeners = () => {
    getCapContainers().forEach(attachAnimationListener);
};

const startCircleRotation = () => {
    if (circleContainer) {
        circleContainer.style.animationPlayState = "running";
    }
};

setCircularLayout();
attachInitialListeners();
startCircleRotation();

const initialLast = getCapContainers().find((cap) => cap.classList.contains("last"));
if (initialLast) {
    activateCapElement(initialLast);
    setCircularLayout();
} else {
    const [firstCap] = getCapContainers();
    if (firstCap) {
        activateCapElement(firstCap);
        setCircularLayout();
    } else {
        addNewCap();
    }
}

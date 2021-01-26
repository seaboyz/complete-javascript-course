(function () {
    const header = document.querySelector("h1");
    header.style.color = "red";

    document.querySelector("body").addEventListener("click", changeToBlue);

    function changeToBlue() {
        header.style.color = "blue";
    }
})();

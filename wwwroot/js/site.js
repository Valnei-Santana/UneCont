var Panel = {
    init: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        $('#openSidebar').on('click', this.openSidebar);
        $('#closeSidebar').on('click', this.closeSidebar);
    },
    openSidebar: function () {
        $('#sidebar').animate({ "left": "0px" }, "slow");
    },
    closeSidebar: function () {
        $('#sidebar').animate({ "left": "-200px" }, "slow");
    }

};


$(document).ready(function () {
    Panel.init();
});

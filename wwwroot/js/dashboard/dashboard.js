var Indicadores = {
    init: function () {
        this.bindElements();
        this.loadData();
    },
    bindElements: function () {
        this.totalEmitidasElement = document.getElementById('totalEmitidas');
        this.semCobrancaElement = document.getElementById('semCobranca');
        this.inadimplenciaElement = document.getElementById('inadimplencia');
        this.aVencerElement = document.getElementById('aVencer');
        this.pagasElement = document.getElementById('pagas');
    },
    loadData: function () {
        ApiService.fetchData('/notes/indicators', (res) => {
            this.totalEmitidasElement.innerHTML = `${formatCurrency(res?.totalEmitidas)}`;
            this.semCobrancaElement.innerHTML = `${formatCurrency(res?.semCobranca)}`;
            this.inadimplenciaElement.innerHTML = `${formatCurrency(res?.inadimplencia)}`;
            this.aVencerElement.innerHTML = `${formatCurrency(res?.aVencer)}`;
            this.pagasElement.innerHTML = `${formatCurrency(res?.pagas)}`;
        });
    }
};

var Graficos = {
    init: function () {
        this.bindElements();
        this.bindEvents();
        this.loadCharts();
    },
    bindElements: function () {
        this.yearReceitaElement = document.getElementById('filterYearReceita');
        this.yearInadimplenciaElement = document.getElementById('filterYearInadimplencia');
    },
    bindEvents: function () {
        this.yearReceitaElement.addEventListener('change', (event) => {
            const selectedYear = event.target.value;
            this.updateReceitaChart(selectedYear);
        });

        this.yearInadimplenciaElement.addEventListener('change', (event) => {
            const selectedYear = event.target.value;
            this.updateInadimplenciaChart(selectedYear);
        });
    },
    loadCharts: function () {
        const currentYear = new Date().getFullYear();
        this.loadReceitaChart(this.yearReceitaElement.value || currentYear);
        this.loadInadimplenciaChart(this.yearInadimplenciaElement.value || currentYear);
    },
    loadReceitaChart: function (year) {
        ApiService.fetchData(`/notes/graphic?year=${year}&type=receita`, (data) => {
            const receitaOptions = {
                chart: {
                    type: 'bar',
                    height: 350
                },
                series: [{
                    name: 'Valor recebido',
                    data: data.data
                }],
                xaxis: {
                    categories: data.categories
                }
            };

            this.receitaChart = new ApexCharts(document.querySelector("#receitaChart"), receitaOptions);
            this.receitaChart.render();
        });
    },
    loadInadimplenciaChart: function (year) {
        ApiService.fetchData(`/notes/graphic?year=${year}&type=inadimplencia`, (data) => {
            const inadimplenciaOptions = {
                chart: {
                    type: 'line',
                    height: 350
                },
                series: [{
                    name: 'Inadimplência',
                    data: data.data
                }],
                xaxis: {
                    categories: data.categories
                }
            };

            this.inadimplenciaChart = new ApexCharts(document.querySelector("#inadimplenciaChart"), inadimplenciaOptions);
            this.inadimplenciaChart.render();
        });
    },
    updateReceitaChart: function (year) {
        ApiService.fetchData(`/notes/graphic?year=${year}&type=receita`, (data) => {
            this.receitaChart.updateOptions({
                series: [{
                    name: 'Valor recebido',
                    data: data.data
                }],
                xaxis: {
                    categories: data.categories
                }
            });
        });
    },
    updateInadimplenciaChart: function (year) {
        ApiService.fetchData(`/notes/graphic?year=${year}&type=inadimplencia`, (data) => {
            this.inadimplenciaChart.updateOptions({
                series: [{
                    name: 'Inadimplência',
                    data: data.data
                }],
                xaxis: {
                    categories: data.categories
                }
            });
        });
    }
};

$(document).ready(function () {
    Indicadores.init();
    Graficos.init();
});
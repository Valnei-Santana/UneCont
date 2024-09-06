var Indicadores = {
    init: function () {
        this.bindElements();
        this.loadData();
        this.bindEvents();
    },
    bindElements: function () {
        this.totalEmitidasElement = document.getElementById('totalEmitidas');
        this.semCobrancaElement = document.getElementById('semCobranca');
        this.inadimplenciaElement = document.getElementById('inadimplencia');
        this.aVencerElement = document.getElementById('aVencer');
        this.pagasElement = document.getElementById('pagas');

        this.filterMonth = document.getElementById('filterMonth');
        this.filterQuarter = document.getElementById('filterQuarter');

        //Filtros
        this.filterIndicators = document.getElementById('filterIndicators');
        this.filterIndicatorsMonth = document.getElementById('filterIndicatorsMonth');
        this.filterIndicatorsYear = document.getElementById('filterIndicatorsYear');
        this.filterIndicatorsQuarter = document.getElementById('filterIndicatorsQuarter');
    },
    bindEvents: function () {
        //Capturo os eventos select de cada filtro de indicadores

        this.filterIndicators.addEventListener('change', (event) => {
            this.updateMonthFilter(event);
            this.loadData();
        });

        this.filterIndicatorsQuarter.addEventListener('change', () => {
            this.loadData();
        });

        this.filterIndicatorsMonth.addEventListener('change', () => {
            this.loadData();
        });

        this.filterIndicatorsYear.addEventListener('change', () => {
            this.loadData();
        });
    },
    loadData: function () {
        const filterType = this.filterIndicators.value;
        const filterYear = this.filterIndicatorsYear.value;
        const filterMonth = this.filterIndicatorsMonth.value;
        const filterQuarter = this.filterIndicatorsQuarter.value;

        ApiService.fetchData(`/notes/indicators?filter=${filterType}&year=${filterYear}&month=${filterMonth}&quarter=${filterQuarter}`, (res) => {
            this.totalEmitidasElement.innerHTML = `${formatCurrency(res?.totalEmitidas)}`;
            this.semCobrancaElement.innerHTML = `${formatCurrency(res?.semCobranca)}`;
            this.inadimplenciaElement.innerHTML = `${formatCurrency(res?.inadimplencia)}`;
            this.aVencerElement.innerHTML = `${formatCurrency(res?.aVencer)}`;
            this.pagasElement.innerHTML = `${formatCurrency(res?.pagas)}`;
        });
    },
    updateMonthFilter: function (event) {
        if (event.target.value === 'month')
            this.filterMonth.style.display = 'block';
        else
            this.filterMonth.style.display = 'none';

        if (event.target.value === 'quarter')
            this.filterQuarter.style.display = 'block';
        else
            this.filterQuarter.style.display = 'none';
    },
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
        //Capturo os eventos select de cada gráfico
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
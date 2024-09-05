function formatCurrency(
    amount,
    locale = 'pt-BR',
    currency = 'BRL',
    minFractionDigits = 2,
    maxFractionDigits = 2,
    useGrouping = true
) {

    if (isNaN(amount) || typeof amount !== 'number') {
        throw new Error('Invalid amount. It must be a number.');
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maxFractionDigits,
        useGrouping: useGrouping
    });

    return formatter.format(amount);
}
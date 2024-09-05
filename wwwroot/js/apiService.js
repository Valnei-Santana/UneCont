var ApiService = {
    fetchData: function (url, callback) {
        $.ajax({
            url: url,
            method: 'GET',
            success: callback,
            error: function (error) {
                console.error('Error: ', error);
            }
        });
    }
};
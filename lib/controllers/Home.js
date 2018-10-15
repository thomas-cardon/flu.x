module.exports = {
  dashboard: function(request, h) {
    return h.view('home', {
      data: {
        perks: []
      },
      page: 'Manaflux board',
      description: 'Manaflux control dashboard'
    });
  },
  login: function(request, h) {
    return h.view('login', {
      data: {
        perks: []
      },
      page: 'Manaflux login page',
      description: 'Manaflux login page'
    });
  }
}

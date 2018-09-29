module.exports = function(request, h) {
  return h.view('home', {
    data: {
      perks: []
    },
    page: 'Manaflux board',
    description: 'Manaflux control dashboard'
  });
};

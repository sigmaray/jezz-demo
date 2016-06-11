(function() {
  $(function() {
    var addPics, doStuff, downloadPics, handleEvents, oldScrollPos, page, scrollPos;
    if ($('#index_page').length) {
      page = 1;
      window.block = false;
      scrollPos = 0;
      oldScrollPos = 0;
      downloadPics = function(pic, page, per_page) {
        var url;
        if (page == null) {
          page = 1;
        }
        if (per_page == null) {
          per_page = PER_PAGE;
        }
        url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + API_KEY + '&text=' + pic + '&safe_search=1&page=' + page + '&per_page=' + per_page;
        window.block = true;
        $('#preloader').show();
        return $.ajax({
          dataType: "json",
          url: url + '&format=json&jsoncallback=?',
          success: function(data) {
            if (data["photos"] == null) {
              return notify(JSON.stringify(["Problem with data", data]));
            } else {
              $('#preloader').hide();
              $.each(data.photos.photo, function(i, item) {
                var flickrUrl, src;
                src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
                flickrUrl = 'https://www.flickr.com/photos/' + item.owner + '/' + item.id;
                return $('#images').append($('<a>').attr('href', flickrUrl).attr('target', '_blank').append($('<img/>').attr('src', src).attr('class', 'flickr_image')));
              });
              window.block = false;
              if ($("body").height() <= $(window).height()) {
                return addPics();
              }
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            return notify(JSON.stringify(['AJAX Error', jqXHR, textStatus, errorThrown]));
          }
        });
      };
      addPics = function() {
        downloadPics($('#searchInput').val(), page);
        return page++;
      };
      doStuff = function() {
        $('#images').html('');
        page = 0;
        return addPics();
      };
      handleEvents = function() {
        $('#searchInput').keypress(function(e) {
          if (e.which === 13) {
            return doStuff();
          }
        });
        $('#goButton').click(function() {
          return doStuff();
        });
        $('#hint_links  a').click(function() {
          $('#searchInput').val($(this).text().trim());
          return doStuff();
        });
        return $(window).scroll(function() {
          scrollPos = $(window).scrollTop();
          if (scrollPos > oldScrollPos) {
            if (($(document).height() - $(window).height() - $(window).scrollTop()) < INFINITE_SCROLL_OFFSET) {
              if (!window.block) {
                addPics();
              }
            }
          }
          return oldScrollPos = scrollPos;
        });
      };
      handleEvents();
      return addPics();
    }
  });

}).call(this);

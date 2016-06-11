(function() {
  $(function() {
    var addPics, doStuff, downloadPics, handleEvents, imgs, initCarousel, oldScrollPos, page, scrollPos;
    if ($('#carousel_page').length) {
      page = 1;
      scrollPos = 0;
      oldScrollPos = 0;
      imgs = [];
      downloadPics = function(pic, page, per_page) {
        var url;
        if (page == null) {
          page = 1;
        }
        if (per_page == null) {
          per_page = PER_PAGE;
        }
        imgs = [];
        url = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + API_KEY + '&text=' + pic + '&safe_search=1&page=' + page + '&per_page=' + per_page;
        return $.ajax({
          dataType: "json",
          url: url + '&format=json&jsoncallback=?',
          success: function(data) {
            if (data["photos"] == null) {
              return notify(JSON.stringify(["Problem with data", data]));
            } else {
              $.each(data.photos.photo, function(i, item) {
                var flickrUrl, src;
                src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
                flickrUrl = 'https://www.flickr.com/photos/' + item.owner + '/' + item.id;
                return imgs.push({
                  src: src,
                  bigImageSrc: flickrUrl
                });
              });
              return initCarousel();
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            return notify(JSON.stringify(['AJAX Error', jqXHR, textStatus, errorThrown]));
          }
        });
      };
      addPics = function() {
        downloadPics($('#searchInput').val(), page, CAROUSEL_PER_PAGE);
        return page++;
      };
      doStuff = function(e) {
        if (typeof tmout !== "undefined" && tmout !== null) {
          window.clearTimeout(tmout);
        }
        imgs = [];
        page = 0;
        return addPics();
      };
      handleEvents = function() {
        $('#goButton').click(function() {
          return doStuff();
        });
        $('#searchInput').keypress(function(e) {
          if (e.which === 13) {
            return doStuff();
          }
        });
        return $('#hint_links  a').click(function() {
          $('#searchInput').val($(this).text().trim());
          return doStuff();
        });
      };
      initCarousel = function() {
        var i, searchText, showImageAndStartTimer;
        i = 0;
        searchText = $('#searchInput').val();
        showImageAndStartTimer = function() {
          $('#img_container').html('');
          $('#img_container').append($('<img>').attr('src', imgs[i].bigImageSrc));
          i++;
          if (i < imgs.length) {
            return window.tmout = window.setTimeout(showImageAndStartTimer, CAROUSEL_TIMEOUT_MILLISECONDS);
          } else {
            page++;
            imgs = [];
            return downloadPics(searchText, page);
          }
        };
        return showImageAndStartTimer();
      };
      handleEvents();
      return addPics();
    }
  });

}).call(this);

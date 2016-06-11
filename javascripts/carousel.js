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
        return $.getJSON(url + '&format=json&jsoncallback=?', function(data) {
          $.each(data.photos.photo, function(i, item) {
            var bigImageSrc, src;
            src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg';
            bigImageSrc = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_c.jpg';
            return imgs.push({
              src: src,
              bigImageSrc: bigImageSrc
            });
          });
          return initCarousel();
        });
      };
      addPics = function() {
        downloadPics($('#searchInput').val(), page, window.CAROUSEL_PER_PAGE);
        return page++;
      };
      doStuff = function(e) {
        console.log('L89');
        if (window.tmout != null) {
          console.log(["l41", 'clearing timeout']);
          window.clearTimeout(tmout);
        }
        console.log('L90');
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
        console.log('L107');
        searchText = $('#searchInput').val();
        showImageAndStartTimer = function() {
          $('#img_container').html('');
          $('#img_container').append($('<img>').attr('src', imgs[i].bigImageSrc));
          i++;
          if (i < imgs.length) {
            return window.tmout = window.setTimeout(showImageAndStartTimer, window.CAROUSEL_TIMEOUT_MILLISECONDS);
          } else {
            page++;
            imgs = [];
            return downloadPics(searchText, page);
          }
        };
        return showImageAndStartTimer();
      };
      console.log("L132");
      handleEvents();
      console.log("L133");
      return addPics();
    }
  });

  console.log('L137');

}).call(this);

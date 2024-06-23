function renderData(items, container) {
    $(container).empty();
    if (items.length === 0) {
        $(container).append('<p class="errorMsg">Oops! No articles were found.</p>');
    } else {
        items.forEach(function (item) {
            $(container).append(`
            <li data-slug="${item.slug}" data-tag="${item.tag}">
                <div>
                    <span>
                        <img src="${item.thumb}" alt=""/>
                    </span>
                    
                    <span>
                        <strong class=${item.tag}>[${item.tag}]</strong>
                        ${item.title}
                    </span>
                </div>
            </li>
        `);
        });

        $(container).find('li').on('click', function () {
            var slug = $(this).data('slug');
            var item = data.find(function (d) { return d.slug === slug; });
            showModal(item);
        });
    }
}

function showModal(item) {
    $('#preloader').show();
    $('#wikiContent').hide();

    setTimeout(function () {
        $('#wikiContent').html(`
            <div class="wikiContent_title">
                <span class=${item.tag}>[${item.tag}]</span>
                <h1>${item.title}</h1>

                <img src=${item.thumb} alt=""/>
            </div>

            <div class="wikiContent_content">
                 ${item.content}
            </div>
            `
        );

        $('#preloader').hide();
        $('#wikiContent').show();
    }, 500);

    $('#wikiWindow').css('display', 'flex');
    window.location.hash = item.slug;

    $('body').css('overflow', 'hidden');
}

$('.wikiModal_close').on('click', function () {
    $('#wikiWindow').css('display', 'none');
    window.location.hash = '';

    $('body').css('overflow', 'auto');
});

$(window).on('click', function (event) {
    if (event.target.id === 'wikiWindow') {
        $('#wikiWindow').css('display', 'none');
        window.location.hash = '';

        $('body').css('overflow', 'auto');
    }
});

function initializePagination(data) {
    $('#pagination-container').pagination({
        dataSource: data,
        pageSize: 4,
        callback: function (data, pagination) {
            renderData(data, '#data-container');
        }
    });
}

function filterData(tag) {
    if (tag === 'all') {
        return data;
    } else {
        return data.filter(function (item) {
            return item.tag === tag;
        });
    }
}

$('input[name="wikiFilter"]').on('change', function () {
    var tag = $(this).attr('id');
    var filteredData = filterData(tag);
    initializePagination(filteredData);
});

$('#search-input').on('input', function () {
    var searchText = $(this).val().toLowerCase();
    var filteredData = data.filter(function (item) {
        return item.title.toLowerCase().includes(searchText) || item.tag.toLowerCase().includes(searchText);
    });

    if (searchText === '') {
        $('#search-container').empty();
    } else {
        renderData(filteredData, '#search-container');
    }
});

function openModalFromHash() {
    var hash = window.location.hash.substring(1);
    var item = data.find(function (d) { return d.slug === hash; });
    if (item) {
        showModal(item);
    }
}

$(window).on('load', function () {
    openModalFromHash();
});

$(window).on('hashchange', function () {
    openModalFromHash();
});

initializePagination(data);

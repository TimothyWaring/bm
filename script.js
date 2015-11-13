// SIMPLE FUNCTION TO SHUFFLE AN ARRAY -> USED SELECT 15 RANDOM QUESTIONS FROM THE DECK.
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// FUNCTION TO MAKE ALL QUESTIONS THE SAME HEIGHT
function resizeSize(question) {
    var h = 0;

    $('.question[data-question="' + (question + 1) + '"]').find('.size').each(function() {
        if ($(this).height() > h) {
            h = $(this).height();
        }
    });

    $('.size').height(h);
}

//IF A CAROUSEL ONLY HAS ONE SLIDE, REMOVE THE CONTROLS TO MOVE LEFT AND RIGHT
function checkCarousels() {

    $('.carousel-inner').each(function() {
        if ($(this).find('.item').length === 1) {
            $(this).parent().find('.carousel-control').hide();
        } else {
            $(this).parent().find('.carousel-control').show();
        }
    });
}

//HELPER TO BIND HASHCHANGE ON MODALS
function bindModal(person) {
    $('#modal .carousel').on('slid.bs.carousel', function() {
        var count = 1;
        var t_number = 0;

        $(this).find('.item').each(function() {
            if ($(this).hasClass('active')) {
                t_number = count;
            } else {
                count++;
            }
        });

        window.location.hash = person + ',' + t_number;

    });
}

// THE MAIN FUNCTION FOR LOADING A PERSONS MODAL
function loadModal(person, number) {

    //GET THE PERSONS OBJECT
    var obj = $('#wall [data-person="' + person + '"]').parent().parent();

    //DEFINE THE ATTRIBUTES
    var name = obj.find('h2').html();
    var image = obj.find('img');
    var carousel = obj.find('.carousel');

    //CLEAR VALUES FROM LAST TIME
    $('.modal_carousel').html('');
    $('.modal_name').html('');
    $('.modal_image').html('');

    //ADD THE NEW VALUES
    $('.modal_name').html(name);
    $('.modal_image').html(image.clone());
    $('.modal_carousel').html(carousel.clone());
    $('.modal_carousel').find('.carousel').carousel({
        interval: false
    });

    //OPEN THE MODAL
    $('#modal').modal('toggle');

    //MAKE SURE THE CORRECT QUOTE IS SHOWING
    $('#modal .carousel .item').removeClass('active');
    $('#modal .carousel .item:eq(' + (number - 1) + ')').addClass('active');

    //BIND EVENT TO THE MODAL TO UPDATE HASH ONE SLID
    bindModal(person);

    //UPDATE HASH
    window.location.hash = person + ',' + number;

    //CHECH IF THE IMAGE HASNT LOADED (IT WAS A DIRECT LINK TO THE QUOTE) AND IF NOT, LOAD IT.
    if ($('#modal').find('img').length === 0) {
        var image_cont = $('[data-person="' + person + '"]');
        var formatted_name = person.replace('_', ' ');
        $('.modal_image').html('<img class="out" src="' + image_cont.attr('src') + '" alt="Funding Circle - Brilliant Minds - ' + formatted_name + '"/> ');
        $('.modal_image').find('img').load(function() {
            $(this).removeClass('out');
        });
    }
}

// MAIN FUNCTION FOR LOADING THE NEXT QUESTION IN
function loadNextQuestion(attempts, question, questions, points) {

    //Decreate the Q by one for eq() puposes
    question--;

    //IF THE QUIZ IS FINISHED
    if ((question + 1) === questions.length) {

        var perc = (points * 100) / 45;
        var pc = Math.round(perc);

        $('.perc_fill').html(Math.round(pc) + '%');

        //UPDATE THE FINISHING TEXT
        if (pc === 0) {
            $('.desc_fil').html('Better luck next time...');
        } else if ((pc > 1) && (pc < 25)) {
            $('.desc_fil').html('<strong>Rank: Novice</strong><br/> "Do not be embarrassed by your failures, learn from them and start again." <br/> Branson');
        } else if ((pc >= 25) && (pc < 50)) {
            $('.desc_fil').html('<strong>Rank: More training required</strong><br/> "One has to remember that every failure can be a stepping-stone to something better." <br/>Colonel Sanders');
        } else if ((pc >= 50) && (pc < 75)) {
            $('.desc_fil').html('<strong>Rank: Market Leader</strong><br/> "When you reach for the stars you may not quite get one, but you won\'t come up with a handful of mud either."<br/> Leo Burnett');
        } else if ((pc >= 75) && (pc <= 99)) {
            $('.desc_fil').html('<strong>Rank: Tycoon</strong><br/> "Success is never accidental."<br/> Jack Dorsey');
        } else if (pc === 100) {
            $('.desc_fil').html('<strong>Rank: Brilliant Mind - You are one of the chosen few!</strong> <Br/> "It\'s kind of fun to do the impossible." <br/> Walter Disney');
        }

        $('#modal_done').modal('toggle');

        //BIND CLICKS FOR THE DONE MODAL
        $('.play_again').click(function() {
            $('#modal_done').modal('toggle');

            $('.question:eq(' + question + ')').fadeOut(function() {
                question = 0;
                $('.question:eq(' + question + ')').fadeIn();
            });

            $('.prog_item').removeClass('active');
            $('.prog_item:eq(0)').addClass('active');

            $('.perc_fill').html('');
            $('.desc_fill').html('');
        });

    } else {

        //QUIZ ISN'T FINISHED SO LOAD THE NEXT QUESTION
        $('.prog_item:eq(' + (question + 1) + ')').addClass('active');

        //UPDATE FEEDBACK WITH CUSTOM MESSAGE
        switch (attempts) {
            case 1:
                $('#modal_correct h2').html("Great knowledge!");
                break;
            case 2:
                $('#modal_correct h2').html("Well done!");
                break;
            case 3:
                $('#modal_correct h2').html("Good Guessing!");
                break;
            case 4:
                $('#modal_correct h2').html('Finally...');
                break;
        }

        //SHOW MODAL SAYING THEY ARE CORRECT
        $('#modal_correct').modal('toggle');

        //HIDE IT AFTER 2 SECONDS
        setTimeout(function() {
            $('#modal_correct').modal('hide');
        }, 2000);

        //FADE OUT CURRENT QUESTION - NAUGHTY FADEOUT
        $('.question[data-question="' + (question + 1) + '"]').fadeOut(function() {
            question++;

            //FADE IN NEXT QUESTION - NAUGHTY FADEIN
            $('.question[data-question="' + (question + 1) + '"]').fadeIn(function() {
                resizeSize(question);
            });
        });
    }
}

//SCROLL HELPER
function scrollFunc() {

    //RESIZE HEADER ON SCROLL
    var s = $(document).scrollTop();

    if (s > 50) {
        $('.top_bar').addClass('mini');
        $('.filter').addClass('mini');
    } else {
        $('.top_bar').removeClass('mini');
        $('.filter').removeClass('mini');
    }
}

//GET BASE 64 FROM URL
function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    var offset;

    for (offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        var i;
        for (i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {
        type: contentType
    });
    return blob;
}

//DEFINING SOME VARS WE NEED
var questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
shuffle(questions);

//INIT THE OAUTH STUFF
OAuth.initialize('zwgcAWn4uC2qBqgZ6nuhaCFwD7E');

//DOC READY
$(document).ready(function() {

    //WINDOW SCROLL HELPER
    $(window).scroll(scrollFunc);

    //SHOW HIDE FILTERS FOR MOBILE
    var filter_on_show = 0;

    $('.show_filter').click(function() {
        if (filter_on_show === 0) {
            filter_on_show = 1;
            $('.filter').css({
                overflow: 'visible',
                height: 'auto'
            });
        } else {
            filter_on_show = 0;
            $('.filter').css({
                overflow: 'hidden',
                height: '42px'
            });
        }
    });

    //JUST MAKE SURE THE CAROUSELS DONE AUTO ROTATE
    $('.carousel').each(function() {
        $(this).carousel({
            interval: false
        });
    });

    ////////////////////////////////////
    ////////////////////////////////////
    /////////     THE QUIZ     /////////
    ////////////////////////////////////
    ////////////////////////////////////

    //SHUFFLE THE ORDER OF THE QUESTIONS
    var q_obj = [];

    $('.question').each(function(i, b) {
        q_obj.push($(this));
    });

    shuffle(q_obj);

    //LOOP THROUGH THEM AND GIVE THEM AN ID BASICALLY
    $(q_obj).each(function(i, b) {
        if (i <= questions.length) {
            $(this).attr('data-question', questions[i]);
        }
    });

    var question = 0;
    var attempts = 0;
    var points = 0;

    //LOAD IN THE FIRST QUESTION
    $('.question[data-question="1"]').fadeIn('fast', function() {
        imagesLoaded($(this), function() {
            resizeSize(question);
        });
    });

    $('a.answer').on('click', function() {

        //SET ANSWER AND CHOICE
        var answer = $(this).parent().data('answer');
        var choice = $(this).data('answer');

        //IF THEY ARE CORRECT
        if (answer === choice) {

            // INCREMENT NUMBER OF ATTEMPTS
            attempts++;

            switch (attempts) {
                case 1:
                    points = points + 3;
                    break;
                case 2:
                    points = points + 2;
                    break;
                case 3:
                    points = points + 1;
                    break;

            }

            //INCREMENT THE QUESTION
            question++;

            loadNextQuestion(attempts, question, questions, points);

            //Reset attempts
            attempts = 0;

        } else {

            //IF THEY ARE INCORRECT
            $(this).addClass('disabled');

            $('#modal_nope').modal('toggle');

            setTimeout(function() {
                $('#modal_nope').modal('hide');
            }, 1000);

            attempts++;

        }
        return false;
    });


    ////////////////////////////////////
    ////////////////////////////////////
    /////////    THE WALL      /////////
    ////////////////////////////////////
    ////////////////////////////////////

    //ONLY DO THIS IS THE WALL EXISTS
    if ($('#wall').length) {

        $('.brick').each(function() {
            $(this).bind('inview', function(event, isInView, visiblePartX, visiblePartY) {

                if (isInView) {
                    var image_cont = $(this).find('.brick_image');

                    if (image_cont.find('img').length === 0) {

                        var name = image_cont.data('person');
                        var formatted_name = name.replace('_', ' ');
                        image_cont.html('<img class="out" src="' + image_cont.attr('src') + '" alt="Funding Circle - Brilliant Minds - ' + formatted_name + '"/> ');
                        image_cont.find('img').load(function() {
                            $(this).removeClass('out');
                        });
                    }
                }
            });
        });
    }

    //HIDE MODAL REMOVE HASH
    $('#modal').on('hidden.bs.modal', function() {
        $('.modal_carousel').html('');
        $('.modal_name').html('');
        $('.modal_image').html('');
        window.location.hash = '';
    });

    //IF URL DIRECT TO QUOTE SPLIT THE URL AND SHOW THE MODAL
    if (window.location.hash) {
        var arr = window.location.hash.split(',');
        loadModal(arr[0].replace('#', ''), arr[1]);
    }

    //MAIN CLICK FUNCTION FOR CLICKING THE PEOPLE
    $('[data-person]').on('click', function() {

        var person = $(this).data('person');
        var carousel = $(this).parent().find('.carousel');

        var count = 1;
        var number = 0;

        carousel.find('.item').each(function() {
            if ($(this).hasClass('active')) {
                number = count;
            } else {
                count++;
            }
        });

        loadModal(person, number);
    });

    //INIT ISOTOPE
    var $container = $('#wall');
    imagesLoaded('#wall', function() {
        $container.isotope({
            itemSelector: '.brick',
            gutter: 0
        });
    });

    //REFRESH ISOTOP AFTER CAROUSEL HAS SLID AS THE QUOTES HAVE VARIABLE HEIGHTS
    $('.carousel').each(function() {
        $(this).on('slid.bs.carousel', function() {
            $container.isotope({
                itemSelector: '.brick',
                gutter: 0
            });
        });
    });

    //CREATE A HIDDEN CAROUSEL
    $('.carousel .carousel-inner').each(function() {
        $(this).parent().append('<div class="hidden">' + $(this).html() + '</div>');
    });

    //REMOVE CONTROLS
    checkCarousels();

    //FILTER LOGIC
    $('.filters').on('click', 'a', function() {

        //MAKE FILTERS TICK THE BOX
        $('.filter_active').removeClass('filter_active');
        $(this).addClass('filter_active');

        var filterValue = $(this).attr('data-filter');
        $container.isotope({
            filter: filterValue
        });

        //UPDATE FILTER TEXT FOR MOBILE
        $('.show_filter span').html($(this).find('span').html());

        //HIDE THE FILTERS ON MOBILE AFTER YOU HAVE SELECTED ONE
        if (filter_on_show === 0) {
            filter_on_show = 1;
            $('.filter').css({
                overflow: 'visible',
                height: 'auto'
            });
        } else {
            filter_on_show = 0;
            $('.filter').css({
                overflow: 'hidden',
                height: '44px'
            });
        }

        //SLIGHT TIMEOUT HERE FOR THE DATA TO CHANGE THEN REFRESH ISOTOPE
        setTimeout(function() {
            $container.isotope({
                itemSelector: '.brick',
                gutter: 0
            });
        }, 200);

        var cat;

        switch (filterValue) {
            case '*':
                cat = 'ALL';
                break;
            case '.Profound_Philosophical':
                cat = 'P';
                break;
            case '.Attitude':
                cat = 'A';
                break;
            case '.Business_Approach':
                cat = 'B';
                break;
            case '.Success_Failure':
                cat = 'S';
                break;
        }

        //CLEAR CAROUSEL
        $('.carousel .carousel-inner').html('');

        //TAKE QUOTES OF THE CORRECT CATEGORY FROM THE HIDDEN CAROUSEL AND DISPLAY THEM
        $('.carousel .carousel-inner').each(function() {
            var t = $(this);

            if (cat === "ALL") {
                t.html($(this).parent().find('.hidden').html());
            } else {
                $(this).parent().find('.hidden').find('.item[data-cat="' + cat + '"]').each(function() {
                    t.append($(this).clone());
                });
            }
            t.find('.item:eq(0)').addClass('active');
        });

        //REFRESH THE HEIGHT AGAIN
        checkCarousels();
    });


    ////////////////////////////////////
    ////////////////////////////////////
    /////////  SOCIAL SHARING  /////////
    ////////////////////////////////////
    ////////////////////////////////////

    ////////////////////////////////////
    // SHARE QUIZ SCORE BY TWITTER
    ////////////////////////////////////
    $('.twit_share_challenge').click(function() {

        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            var t_img = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            OAuth.popup("twitter").then(function(result) {
                var data = new FormData();
                data.append('status', 'I just scored ' + $('.perc_fill').html() + ' in the Brilliant Minds Quiz by Funding Circle. Think you can beat it? Try here XXXXXXXXXXXXX');
                data.append('media[]', b64toBlob(t_img));

                return result.post('/1.1/statuses/update_with_media.json', {
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false
                });
            });
        };

        img.src = 'images/brain.jpg';
        return false;

    });

    ////////////////////////////////////
    // END SHARE QUIZ SCORE BY TWITTER
    ////////////////////////////////////


    ////////////////////////////////////
    // SHARE QUOTE BY TWITTER
    ////////////////////////////////////
    $('.twit_share').click(function() {

        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            var t_img = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            OAuth.popup("twitter").then(function(result) {
                var data = new FormData();
                data.append('status', '100 Brilliant Business Minds And What They Said by www.FundingCircle.com See them all here XXXXXXXXXXXXX');
                data.append('media[]', b64toBlob(t_img));

                return result.post('/1.1/statuses/update_with_media.json', {
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false
                });
            });
        };

        img.src = 'quotes/' + $('.modal-body .item.active').attr('image-file');

        return false;
    });
    ////////////////////////////////////
    // END SHARE QUOTE BY TWITTER
    ////////////////////////////////////


    ////////////////////////////////////
    // SHARE QUOTE BY EMAIL
    ////////////////////////////////////
    $('.email_share').click(function() {
        $('#modal').modal('hide');
        $('#modal_send').modal('show');
        $('#file_fill').val('quotes/' + $('#modal .modal-body .item.active').attr('image-file'));
    });

    //SUBMIT EMAIL SHARE FORM
    $('#modal_send form').submit(function(e) {
        e.preventDefault();
        var t = $(this);
        $.ajax({
            type: "POST",
            url: t.attr('action'),
            data: t.serialize(),
            success: function(data) {
                if (data === 1) {
                    $(t).append('<div style="margin-top:10px;">Your email was sent, Thanks for sharing!</div>');
                } else {
                    $(t).append('<div style="margin-top:10px;">Your email was not sent, please try again.</div>');
                }
            }
        });
        return false;
    });
    ////////////////////////////////////
    // END SHARE QUOTE BY EMAIL
    ////////////////////////////////////

    ////////////////////////////////////
    // SHARE WHOLE PAGE VIA TWITTER
    ////////////////////////////////////
    $('.twit_glob').click(function() {

        var img = new Image();

        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");

            var t_img = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            OAuth.popup("twitter").then(function(result) {
                var data = new FormData();
                data.append('status', '100 Brilliant Business Minds And What They Said by www.FundingCircle.com See them all here XXXXXXXXXXXXX');
                data.append('media[]', b64toBlob(t_img));

                return result.post('/1.1/statuses/update_with_media.json', {
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false
                });
            });
        };

        img.src = 'images/brain.jpg';
        return false;

    });
    ///////////////////////////////////
    // END SHARE WHOLE PAGE VIA TWITTER
    ////////////////////////////////////
});
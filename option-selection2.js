(function () {

  if ( (typeof window.Shopify) == "undefined" ) {
    window.Shopify = {};
  }

  Shopify.OptionSelectors2 = function(container, options) {
    if( ! container.tagName ) {
      container = document.querySelector(container);
    }

    this.container = container;

    options = typeof options !== "undefined" ? options : {};

    var product = this.product = options.product;
    var onVariantSelected = this.onVariantSelected = options.onVariantSelected;
    var enableHistoryState = this.enableHistoryState = options.enableHistoryState;

    var optionInputsSelector = this.optionInputsSelector = ".js-product-option-input";
    var variantIdInputSelector = this.variantIdInputSelector = ".js-product-variant-id-input";

    var optionInputs = this.optionInputs = container.querySelectorAll(optionInputsSelector);
        optionInputs = this.optionInputs = Array.prototype.slice.call(optionInputs);
    var variantIdInput = this.variantIdInput = container.querySelector(variantIdInputSelector);

    if( (!product) || (!optionInputs.length) || (!variantIdInput) ) {
      return;
    }

    if( enableHistoryState ) {
      updateUrl( variantIdInput.value );
    }

    optionInputs.forEach(function(element, i) {
      element.addEventListener( "change", updateVariantId, false );
    });

    onVariantSelected( getCurrentVariant(), container );

    variantIdInput.addEventListener("change", function() {
      onVariantSelected( getCurrentVariant(), container );
    }, false);

    function updateVariantId() {
      var input = this;

      var variant = getVariantByInputs();

      variantIdInput.value = variant.id;

      onVariantSelected(variant, container);

      if ( enableHistoryState ) {
        updateUrl(variant.id);
      }
    }

    function updateUrl(id) {
      var newUrl = window.location.href + (window.location.search == "" ? "?" : "&") + "variant=" + id;

      if( window.location.search.indexOf("variant=") != -1 ) {
        newUrl = window.location.href.replace(/variant=\d+/g, "variant=" + id);
      }

      if( window.history.pushState ) {
        window.history.pushState( {}, null, newUrl );
      }
    }

    function getVariantByInputs() {
      var selectedVariant = null;
      var values = {};

      optionInputs.forEach(function(element, i) {
        var option = element.getAttribute("name");

        if ( element.tagName == "SELECT" || element.checked ) {
          values[option] = element.value;
        }
      });

      product.variants.forEach(function (variant, i) {
        if ( variant.option1 == values.option1 && variant.option2 == values.option2 && variant.option3 == values.option3 ) {
          selectedVariant = variant;
          return;
        }
      });

      return selectedVariant;
    }

    function getCurrentVariant() {
      return getVariantById( variantIdInput.value );
    }

    function getVariantById(id) {
      return product.variants.filter(function(variant) {
        return variant.id == id;
      })[0];
    }
  }

  Shopify.OptionSelectors2.prototype.selectVariant = function(id) {
    var instance = this;

    var variant = instance.product.variants.filter(function(variant) {
      return variant.id == id;
    })[0];

    if( !variant ) {
      return;
    }

    instance.product.options.forEach(function (option, i) {
      var input = null;

      var option = variant.options[i];

      var option_key = "option" + (i+1);

      instance.optionInputs.forEach(function(element, i) {
        if( element.name == option_key ) {
          if ( element.tagName == "SELECT" ) {
            input = element;
          } else {
            if( element.value == option ) {
              input = element;
            }
          }
        }
      });

      if( input ) {
        if ( input.tagName == "SELECT" ) {
          input.value = option;
        } else {
          input.checked = true;
        }
      }
    });

    if( document.createEvent ) {
      instance.optionInputs[0].dispatchEvent( new Event("change") );
    } else {
      instance.optionInputs[0].fireEvent( "onchange", document.createEventObject() );
    }
  }

})();

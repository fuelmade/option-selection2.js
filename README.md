# option-selection2.js

A sane alternative to Shopify's multiple option JavaScript helper (option_selection.js).

```
{{ "option-selection2.js" | asset_url | script_tag }}
```

```
<script>
  (function () {
    var product = {{ product | json }};

    var container = ".js-product-options";

    var productOptionSelectors = new Shopify.OptionSelectors2(container, {
      product: product,
      onVariantSelected: callback,
      enableHistoryState: true
    });

    productOptionSelectors.selectVariant( 15554208966 );

    function callback(variant, container) {
      console.log( variant );

      // enable / disable add to cart button
      // change price
      // update image with variant image
    }
  })();
</script>
```

```
    <script>
      (function () {
        $("[data-product]").each(function() {
          var product = JSON.parse( $(this).attr("data-product") );

          var container = $(this).find(".js-product-options")[0];

          var optionSelectors = new Shopify.OptionSelectors2(container, {
            product: product,
            onVariantSelected: callback
          });

          optionSelectors.selectVariant( 15554208966 );

          function callback(variant, container) {
            console.log( variant );

            // enable / disable add to cart button
            // change price
            // update image with variant image
          }
        });
      })();
    </script>
```

```
<div class="js-product-options">
  {% unless product.variants.size == 1 and product.variants[0].title contains "Default" %}
    {% for i in (1..product.options.size) %}
      {% assign i0 = i | minus: 1 %}

      {% assign option = product.options[i0] %}

      {% assign option_key = "option" | append: i %}

      {% assign option_choices = product.variants | map: option_key | uniq %}

      {% assign selected_option_choice = product.selected_or_first_available_variant[option_key] %}

      {% unless option == "Material" %}
        <label for="{{ option_key }}">
          {{ option }}
        </label>

        <select class="js-product-option-input" id="{{ option_key }}" name="{{ option_key }}">
          {% for option_choice in option_choices %}
            {% assign selected = false %}

            {% if option_choice == selected_option_choice %}
              {% assign selected = true %}
            {% endif %}

            <option value="{{ option_choice }}" {% if selected %}selected{% endif %}>
              {{ option_choice }}
            </option>
          {% endfor %}
        </select>
      {% else %}
        <fieldset>
          <legend>
            {{ option }}
          </legend>

          {% for option_choice in option_choices %}
            {% assign checked = false %}

            {% if option_choice == selected_option_choice %}
              {% assign checked = true %}
            {% endif %}

            <label>
              <input class="js-product-option-input" type="radio" name="{{ option_key }}" value="{{ option_choice }}" {% if checked %}checked{% endif %} />
              {{ option_choice }}
            </label>
          {% endfor %}
        </fieldset>
      {% endunless %}
    {% endfor %}
  {% endunless %}

  <input class="js-product-variant-id-input" type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
</div>

```
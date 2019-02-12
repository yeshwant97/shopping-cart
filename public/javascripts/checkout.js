var stripe = Stripe('pk_test_6o5Px2gSOafndJGqmzjMqNdk');
var elements = stripe.elements();

var card = elements.create('card',{hidePostalCode: true,
  style: {
          base: {
                  iconColor: '#8898AA',
                  color: 'black',
                  lineHeight: '36px',
                  fontWeight: 300,
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '19px',
                  '::placeholder': {
                    color: '#8898AA',
                  },
                },

          invalid: {
                  iconColor: '#e85746',
                  color: '#e85746',
                }
        }
});

// Add an instance of the card UI component into the `card-element` <div>
card.mount('#card-element');
  
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  }
});

var form = document.getElementById('payment-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  createToken();
});

function createToken() {
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      stripeTokenHandler(result.token);
    }
  });
};

function stripeTokenHandler(token) {
  // Insert the token ID into the form so it gets submitted to the server
  var form = document.getElementById('payment-form');
  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'stripeToken');
  hiddenInput.setAttribute('value', token.id);
  form.appendChild(hiddenInput);

  // Submit the form
  form.submit();
}

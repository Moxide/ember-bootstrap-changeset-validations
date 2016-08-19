import Ember from 'ember';
import BsForm from 'ember-bootstrap/components/bs-form';

const { computed, RSVP, on, observer } = Ember;

export default BsForm.extend({

  hasValidator: computed.notEmpty('model.validate'),
  submit(e) {
      if (e) {
        e.preventDefault();
      }

      this.sendAction('before');

      if (!this.get('hasValidator')) {
        return this.sendAction();
      } else {
        let validationPromise = this.validate(this.get('model'));
        if (validationPromise && validationPromise instanceof Ember.RSVP.Promise) {
          validationPromise.then((r) => this.sendAction('action', this.get('model'), r), (err) => {
            this.get('childFormElements').setEach('showValidation', true);
            return this.sendAction('invalid', this.get('model'), err);
          });
        }
      }
    },
  validate(model) {
    let m = model;

    Ember.assert('Model must be a Changeset instance', m && typeof m.validate === 'function');
    return m.get('isValid') ? RSVP.resolve() : RSVP.reject();
  },

  _initValidation: on('init', observer('model', function() {
    if (this.get('hasValidator')) {
      this.get('model').validate();
    }
  }))
});

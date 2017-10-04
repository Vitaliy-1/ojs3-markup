/**
 * @file js/MarkupSubmissionsBatchConversion.js
 *
 * Copyright (c) 2014-2017 Simon Fraser University
 * Copyright (c) 2000-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * @package plugins.generic.markup
 * @class MarkupSubmissionsBatchConversion
 *
 * @brief Batch conversion client side handler
 */
(function($) {

	/** @type {Object} */
	$.pkp.plugins.markup =
			$.pkp.plugins.markup ||
			{ js: { } };

	/**
	 * @constructor
	 */
	$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion = function() {
		if ($('#conversion-status').length) {
			$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion.prototype.monitor();
		}

		$('button#stopConversionBtn').click(function(e){
			e.preventDefault();
			if(confirm('Cancel batch conversion job?')) {
				window.location = $(this).data('cancel-url');
			}
		});
	};

	/**
	 * trigger conversion monitoring
	 */
	$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion.prototype.monitor = 
		function() {
			var that = this; 
			this.timer = setInterval(function() { 
				that.fetchJobStatus.apply(that); 
			}, 5000);
	}

	/**
	 * A Number, representing the ID value of the timer that is set.
	 * @private
	 * @type {int}
	 */
	$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion.timer = null;

	/**
	 * Callback to fetch xml job status
	 */
	$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion.prototype.fetchJobStatus = 
		function() {
			var self = this;
			$.ajax({
				url: $('#conversion-status').data('status-url'),
				type: 'POST',
				dataType: 'json',
				success: function(data) {
					if (data['content'].hasOwnProperty('errorMessage')) {
						$('#conversion-status').text(data['content']['errorMessage']);
						self.stopAndClear();
					}
					else {
						$('#conversion-status > div.output').html(data['content']);
					}
				},
				error: function(xhr, status, error) {
					$('#conversion-status').text('An unexpected error occured => ' + error)
					self.stopAndClear();
				}
			});
	}

	/**
	 * stop timer and hide spinner
	 */
	$.pkp.plugins.markup.js.MarkupSubmissionsBatchConversion.prototype.stopAndClear = 
		function() {
			$('.pkp_spinner', '#conversion-status').removeClass('is_visible');
			clearInterval(this.timer);
			this.timer = null;
	}

}(jQuery));
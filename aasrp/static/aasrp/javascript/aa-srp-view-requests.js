/* global aaSrpSettings, moment */

$(document).ready(() => {
    'use strict';

    const elementSrpRequestsTable = $('#tab_aasrp_srp_requests');

    /**
     * Table :: SRP Requests
     *
     * @type {*|jQuery}
     */
    const srpRequestsTable = elementSrpRequestsTable.DataTable({
        ajax: {
            url: aaSrpSettings.url.requestsForSrpLink,
            dataSrc: '',
            cache: false
        },
        columns: [
            {
                data: 'request_time',
                render: (data, type, row) => {
                    return moment(data).utc().format(aaSrpSettings.datetimeFormat);
                },
                className: 'srp-request-time'
            },
            {
                data: 'requester',
                className: 'srp-request-requester'
            },
            {
                data: 'character_html',
                render: {
                    display: 'display',
                    _: 'sort'
                },
                className: 'srp-request-character'
            },
            {
                data: 'request_code',
                className: 'srp-request-code'
            },
            {
                data: 'ship_html',
                render: {
                    display: 'display',
                    _: 'sort'
                },
                className: 'srp-request-ship'
            },
            // {data: 'zkb_link'},
            {
                data: 'zbk_loss_amount',
                /**
                 * Render callback
                 *
                 * @param data
                 * @param type
                 * @param row
                 * @param meta
                 * @returns {string|*}
                 */
                render: (data, type, row, meta) => {
                    if (type === 'display') {
                        return data.toLocaleString() + ' ISK';
                    } else {
                        return data;
                    }
                },
                className: 'srp-request-zbk-loss-amount text-right'
            },
            {
                data: 'payout_amount',
                /**
                 * Render callback
                 *
                 * @param data
                 * @param type
                 * @param row
                 * @param meta
                 * @returns {string|*}
                 */
                render: (data, type, row, meta) => {
                    if (type === 'display') {
                        return '<span class="srp-payout-amount">' + data.toLocaleString() + ' ISK</span>';
                    } else {
                        return data;
                    }
                },
                className: 'srp-request-payout text-right'
            },
            {
                data: 'request_status_icon',
                className: 'srp-request-status text-center'
            },
            {
                data: 'actions',
                className: 'srp-request-actions'
            },

            /**
             * Hidden columns
             */
            {data: 'ship'},
            {data: 'request_status'},
            {data: 'character'}
        ],
        columnDefs: [
            {
                orderable: false,
                targets: [7, 8]
            },
            {
                visible: false,
                targets: [9, 10, 11]
            },
            {
                width: 115,
                targets: [8]
            }
        ],
        order: [
            [0, 'asc']
        ],
        filterDropDown: {
            columns: [
                {
                    idx: 1
                },
                {
                    idx: 11,
                    title: aaSrpSettings.translation.filter.character
                },
                {
                    idx: 9,
                    title: aaSrpSettings.translation.filter.ship
                },
                {
                    idx: 10,
                    title: aaSrpSettings.translation.filter.requestStatus
                }
            ],
            autoSize: false,
            bootstrap: true
        },
        paging: false,
        /**
         * When ever a row is created ...
         *
         * @param row
         * @param data
         * @param rowIndex
         */
        createdRow: (row, data, rowIndex) => {
            const srpRequestCode = data.request_code;
            const srpRequestStatus = data.request_status.toLowerCase();
            const srpRequestPayoutAmount = data.payout_amount;

            // Row id attr
            $(row)
                .attr('data-row-id', rowIndex)
                .attr('data-srp-request-code', srpRequestCode)
                .addClass('srp-request-status-' + srpRequestStatus);

            $(row)
                .find('span.srp-payout-amount')
                .attr('data-value', srpRequestPayoutAmount);

            // Add class and data attribute to the payout span
            if (srpRequestStatus === 'pending' || srpRequestStatus === 'rejected') {
                $(row)
                    .find('td.srp-request-payout')
                    .addClass('srp-request-payout-amount-editable');

                $(row)
                    .find('span.srp-payout-amount')
                    .addClass('srp-request-' + srpRequestCode)
                    .attr(
                        'data-params',
                        '{csrfmiddlewaretoken:\'' + aaSrpSettings.csrfToken + '\'}'
                    )
                    .attr('data-pk', srpRequestCode)
                    .attr('data-tooltip', 'enable')
                    .attr('title', aaSrpSettings.translation.changeSrpPayoutAmount)
                    .attr(
                        'data-url',
                        aaSrpSettings.url.changeSrpAmount.replace(
                            'SRP_REQUEST_CODE', srpRequestCode
                        )
                    );
            }
        }
    });

    /**
     * Helper function: Refresh the Payout Amount field
     *
     * @param element
     * @param {int} newValue
     * @private
     */
    const _refreshSrpAmountField = (element, newValue) => {
        newValue = parseInt(newValue);

        // Update payout value formatted
        const newValueFormatted = newValue.toLocaleString() + ' ISK';

        // Update the element
        element
            .attr('data-value', newValue)
            .addClass('srp-payout-amount-changed')
            .html(newValueFormatted);

        // Update fleet total SRP amount
        let totalSrpAmount = 0;
        const elementSrpAmount = $(
            '#tab_aasrp_srp_requests .srp-request-status-approved .srp-payout-amount'
        );

        elementSrpAmount.each((i, payoutElement) => {
            totalSrpAmount += parseInt(payoutElement.getAttribute('data-value'));
        });

        $('.srp-fleet-total-amount').html(totalSrpAmount.toLocaleString() + ' ISK');
    };

    /**
     * When the DataTable has finished rendering and is fully initialized
     */
    srpRequestsTable.on('draw', () => {
        // Make SRP payout field editable for pending and rejected requests
        elementSrpRequestsTable.editable({
            container: 'body',
            selector: '.srp-request-payout-amount-editable .srp-payout-amount',
            title: aaSrpSettings.translation.changeSrpPayoutHeader,
            type: 'number',
            placement: 'top',
            /**
             * @param value
             * @param response
             * @returns {boolean}
             */
            display: (value, response) => {
                return false;
            },
            /**
             * On success ...
             *
             * Arrow functions doesn't work here since we need `$(this)`
             *
             * @param response
             * @param newValue
             */
            success: function (response, newValue) {
                _refreshSrpAmountField($(this), newValue);
            },
            /**
             * Check if input is not empty
             *
             * @param {string} value
             * @returns {string}
             */
            validate: (value) => {
                if (value === '') {
                    return aaSrpSettings.translation.editableValidate;
                }
            }
        });

        // Show bootstrap tooltips
        $('[data-tooltip="enable"]').tooltip();
    });

    /**
     * Reloading SRP calculation in our DataTable
     *
     * @param tableData
     * @private
     */
    const _reloadSrpCalculations = (tableData) => {
        let totalSrpAmount = 0;
        let requestsTotal = 0;
        let requestsPending = 0;
        let requestsApproved = 0;
        let requestsRejected = 0;

        $.each(tableData, (i, item) => {
            requestsTotal += 1;

            if (item.request_status === 'Pending') {
                requestsPending += 1;
            }

            if (item.request_status === 'Approved') {
                totalSrpAmount += parseInt(item.payout_amount);
                requestsApproved += 1;
            }

            if (item.request_status === 'Rejected') {
                requestsRejected += 1;
            }
        });

        // Update fleet total SRP amount
        $('.srp-fleet-total-amount').html(totalSrpAmount.toLocaleString() + ' ISK');

        // Update requests counts
        $('.srp-requests-total-count').html(requestsTotal);
        $('.srp-requests-pending-count').html(requestsPending);
        $('.srp-requests-approved-count').html(requestsApproved);
        $('.srp-requests-rejected-count').html(requestsRejected);
    };

    /**
     * Modals
     */
    const modalSrpRequestDetails = $('#srp-request-details');
    const modalSrpRequestAccept = $('#srp-request-accept');
    const modalSrpRequestAcceptRejected = $('#srp-request-accept-rejected');
    const modalSrpRequestReject = $('#srp-request-reject');
    const modalSrpRequestRemove = $('#srp-request-remove');

    // SRP request details
    modalSrpRequestDetails.on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const url = button.data('link');

        $.get({
            url: url,
            success: (data) => {
                modalSrpRequestDetails.find('.modal-body').html(data);
            }
        });
    }).on('hide.bs.modal', () => {
        modalSrpRequestDetails.find('.modal-body').text('');
    });

    // Accept SRP request
    modalSrpRequestAccept.on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const url = button.data('link');

        $('#modal-button-confirm-accept-request').on('click', (event) => {
            const form = modalSrpRequestAccept.find('form');
            const reviserComment = form.find('textarea[name="reviser_comment"]').val();
            const csrfMiddlewareToken = form.find('input[name="csrfmiddlewaretoken"]')
                .val();

            const posting = $.post(
                url,
                {
                    reviser_comment: reviserComment,
                    csrfmiddlewaretoken: csrfMiddlewareToken
                }
            );

            posting.done((data) => {
                if (data['0'].success === true) {
                    srpRequestsTable.ajax.reload((tableData) => {
                        _reloadSrpCalculations(tableData);
                    });
                }
            });

            modalSrpRequestAccept.modal('toggle');
        });
    }).on('hide.bs.modal', () => {
        modalSrpRequestAccept.find('textarea[name="reject_info"]').val('');

        $('#modal-button-confirm-accept-request').unbind('click');
    });

    // Accept former rejected SRP request
    modalSrpRequestAcceptRejected.on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const url = button.data('link');

        $('#modal-button-confirm-accept-rejected-request').on('click', () => {
            const form = modalSrpRequestAcceptRejected.find('form');
            const reviserComment = form.find('textarea[name="reviser_comment"]').val();
            const csrfMiddlewareToken = form.find('input[name="csrfmiddlewaretoken"]')
                .val();

            if (reviserComment === '') {
                const errorMessage = '<div class="aasrp-form-field-errors clearfix">' +
                    '<p>' + aaSrpSettings.translation.modal.form.error.fieldRequired + '</p>' +
                    '</div>';

                form.find('.aasrp-form-field-errors').remove();

                $(errorMessage).insertAfter(
                    $('textarea[name="accept_rejected_request_comment"]')
                );
            } else {
                const posting = $.post(
                    url,
                    {
                        reviser_comment: reviserComment,
                        csrfmiddlewaretoken: csrfMiddlewareToken
                    }
                );

                posting.done((data) => {
                    if (data['0'].success === true) {
                        srpRequestsTable.ajax.reload((tableData) => {
                            _reloadSrpCalculations(tableData);
                        });
                    }
                });

                modalSrpRequestAcceptRejected.modal('toggle');
            }
        });
    }).on('hide.bs.modal', () => {
        modalSrpRequestAcceptRejected.find('textarea[name="reject_info"]').val('');

        $('.aasrp-form-field-error').remove();
        $('#modal-button-confirm-accept-rejected-request').unbind('click');
    });

    // Reject SRP request
    modalSrpRequestReject.on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const url = button.data('link');

        $('#modal-button-confirm-reject-request').on('click', () => {
            const form = modalSrpRequestReject.find('form');
            const rejectInfo = form.find('textarea[name="reject_info"]').val();
            const csrfMiddlewareToken = form.find('input[name="csrfmiddlewaretoken"]')
                .val();

            if (rejectInfo === '') {
                const errorMessage = '<div class="aasrp-form-field-errors clearfix">' +
                    '<p>' + aaSrpSettings.translation.modal.form.error.fieldRequired + '</p>' +
                    '</div>';

                form.find('.aasrp-form-field-errors').remove();

                $(errorMessage).insertAfter($('textarea[name="reject_info"]'));
            } else {
                const posting = $.post(
                    url,
                    {
                        reject_info: rejectInfo,
                        csrfmiddlewaretoken: csrfMiddlewareToken
                    }
                );

                posting.done((data) => {
                    if (data['0'].success === true) {
                        srpRequestsTable.ajax.reload((tableData) => {
                            _reloadSrpCalculations(tableData);
                        });
                    }
                });

                modalSrpRequestReject.modal('toggle');
            }
        });
    }).on('hide.bs.modal', () => {
        modalSrpRequestReject.find('textarea[name="reject_info"]').val('');

        $('.aasrp-form-field-errors').remove();
        $('#modal-button-confirm-reject-request').unbind('click');
    });

    // Remove SRP request
    modalSrpRequestRemove.on('show.bs.modal', (event) => {
        const button = $(event.relatedTarget);
        const url = button.data('link');

        $('#modal-button-confirm-remove-request').on('click', (event) => {
            $.get(url, (data, status) => {
                // Reload datatable on success and update SRP status values
                if (data['0'].success === true) {
                    srpRequestsTable.ajax.reload((tableData) => {
                        _reloadSrpCalculations(tableData);
                    });
                }
            });
        });
    }).on('hide.bs.modal', () => {
        modalSrpRequestRemove.find('textarea[name="reject_info"]').val('');

        $('#modal-button-confirm-remove-request').unbind('click');
    });
});

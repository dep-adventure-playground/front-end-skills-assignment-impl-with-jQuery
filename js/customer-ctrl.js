/*
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                     Version 2, December 2004
 *
 *  Copyright (C) 2020 IJSE. All Rights Reserved.
 *
 *  Everyone is permitted to copy and distribute verbatim or modified
 *  copies of this license document, and changing it is allowed as long
 *  as the name is changed.
 *
 *             DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *   0. You just DO WHAT THE FUCK YOU WANT TO.
 */

/**
 * @author : Ranjith Suranga <suranga@ijse.lk>
 * @since : 11/15/20
 **/

/*===============================================================================
 * Global Variables
 *===============================================================================*/

var txtId;
var txtName;
var txtAddress;
var tblCustomers;
var customers = [];
var selectedCustomer = null;
var selectedRow = null;
var pageSize = -1;
var pageCount = 1;
var startPageIndex = 0;
var endPageIndex = -1;
var MAX_PAGES = 3;

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init() {
    txtId = $('#txt-id');
    txtName = $('#txt-name');
    txtAddress = $('#txt-address');
    tblCustomers = $('#tbl-customers');

    txtId.focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

$('#btn-save').click(handleSave);
$('document').click(handleClickEventDelegation);
txtId.keypress(handleInput);
txtName.keypress(handleInput);
txtAddress.keypress(handleInput);

/*===============================================================================
 * Functions
 *===============================================================================*/

function handleClickEventDelegation(event) {
    if (event.target) {
        var activePage;
        if (event.target.matches('#btn-backward *')) {
            activePage = startPageIndex;
            endPageIndex = startPageIndex - 1;
            startPageIndex = endPageIndex - (MAX_PAGES - 1);
            if (startPageIndex < 0) {
                activePage = 1;
                startPageIndex = 0;
                endPageIndex = startPageIndex + (MAX_PAGES - 1);
            }
            initPagination();
            renderPage(activePage);
        } else if (event.target.matches("#btn-forward *")) {
            startPageIndex = startPageIndex + MAX_PAGES;
            activePage = startPageIndex + 1;
            endPageIndex = startPageIndex + (MAX_PAGES - 1);
            if (startPageIndex > pageCount) {
                endPageIndex = -1;
                activePage = pageCount;
            }
            initPagination();
            renderPage(activePage);
        } else if (event.target.matches("li.page-item *")) {
            renderPage(+event.target.innerText);
        }
    }
}

function handleSave(event) {
    if (!validate()) {
        return;
    }

    /*
     * What are Truthy in JavaScript?
     * https://developer.mozilla.org/en-US/docs/Glossary/Truthy
     *
     * What are Falsy in JavaScript?
     * https://developer.mozilla.org/en-US/docs/Glossary/Falsy
     */

    /* Let's check whether we want to save or update */
    if (!selectedCustomer) {

        /* There is no selected customer which means we need to save */
        customers.push({
            id: txtId.val(),
            name: txtName.val(),
            address: txtAddress.val()
        });

        /* Let's initialize pagination */
        initPagination();
        // renderPage(Math.ceil(customers.length / pageSize));
        showOrHideTFoot();

        /* Let's ready for next entry */
        txtId.val("");
        txtName.val("");
        txtAddress.val("");
        txtId.focus();

    } else {

        /* There is a selected customer which means we need to update */
        selectedCustomer.name = txtName.val();
        selectedCustomer.address = txtAddress.val();
        selectedRow.cells[1].innerText = txtName.val();
        selectedRow.cells[2].innerText = txtAddress.val();
    }

}

function initPagination() {

    var paginationElm = $("#pagination");

    /* Let's calculate the page size */
    pageSize = -1;
    clearTable();
    if (customers.length > 0) {

        /* First we need to check whether bootstrap has activated mobile styling  */
        if ((innerWidth < 992) && pageSize === -1) {
            pageSize = 6;
        } else {

            clearTable();
            /* Let's add a temp row to the table so we can find out the row size */
            addCustomersToTable(0, customers.length);

            /* Let's get necessary coordinates and dimensions */
            var topPos = tblCustomers.find("tbody tr:first-child").offset().top;
            // var topPos = tblCustomers.tBodies[0].rows[0].offset().top;
            var rowHeight = tblCustomers.children("tbody tr:first-child").height;
            // var rowHeight = tblCustomers.children("tbody tr:first-child").clientHeight;
            var paginationHeight = paginationElm.height;
            var margin = 40;
            var i = 1;

            /* Let's find out the page size */
            do {
                var totalHeight = topPos + (rowHeight * i) + paginationHeight + margin;
                i++;
            } while (totalHeight < $("footer").offset().top);

            /* Since this do while loop, you gonna need to subtract two at the end */
            pageSize = i - 2;

            /* Let's remove the temp row that we added previously */
            // clearTable();
        }
    }

    // /* Let's calculate the page count */
    // if (pageSize === -1) {
    //     pageCount = 1;
    // } else {
    //     pageCount = Math.ceil(customers.length / pageSize);
    // }
    //
    // /* Let's determine whether we display the pagination or not */
    // if (pageCount > 1) {
    //     paginationElm.removeClass("hidden");
    // } else {
    //     paginationElm.addClass('hidden');
    // }
    //
    // if (endPageIndex === -1) {
    //     endPageIndex = pageCount;
    //     startPageIndex = endPageIndex - ((endPageIndex % MAX_PAGES) == 0 ? MAX_PAGES : (endPageIndex % MAX_PAGES));
    // }
    //
    // var html = '<li class="page-item" id="btn-backward">' +
    //     '           <a class="page-link" href="#"><i class="fas fa-backward"></i></a>' +
    //     '       </li>';
    // for (var i = 0; i < pageCount; i++) {
    //     if (i >= startPageIndex && i <= endPageIndex) {
    //         html += '<li class="page-item"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
    //     } else {
    //         html += '<li class="page-item d-none"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
    //     }
    // }
    // html += '<li class="page-item" id="btn-forward">' +
    //     '          <a class="page-link" href="#"><i class="fas fa-forward"></i></a>' +
    //     '    </li>';
    // $(".pagination").html(html);
    // endPageIndex = -1;
}

function renderPage(page) {

    if (!page) {
        return;
    }

    /* In case of invalid page, let's try to be nice */
    if (page < 1) {
        page = 1;
    }
    if (page > pageCount) {
        page = pageCount;
    }

    /* Let's remove active status of the previous page */
    var exActivePage = $("#pagination .page-item.active");
    if (exActivePage !== null) {
        exActivePage.removeClass('active');
    }

    /* Let's set the active status to the current page
     * The first li element of the pagination is the backward button = li:nth-child(1)
     * Keep in mind nth-child start with 1 not with 0
     * So if you want active the second page you need to add 1 more to the page
     * <ul class="pagination">
     *      <li class="page-item" id="btn-backward"></li>   <--- li:first-child or li:nth-child(1)
     *      <li class="page-item">1</li>                    <--- li:nth-child(2)
     *      <li class="page-item">2</li>                    <--- li:nth-child(3)
     *      <li class="page-item" id="btn-forward"></li>    <--- li:last-child or li:nth-child(4)
     * </ul>
     *  */

    $('.pagination li:nth-child(' + (page + 1) + ')').addClass('active');

    /* Let's check whether we want to disable backward button or forward button */
    toggleBackwardForwardDisability(page);

    /* Okay if the JVM here, it means we have already calculated the page size */
    clearTable();

    /* Let's take an example, if we want to render the page number 2 and the page size equals to 6
     * Then we have to start from 6 = (2 - 1) * 6
     * And we have to continue iterating until 12 = (2 * 12) */
    addCustomersToTable((page - 1) * pageSize, page * pageSize);

}

function clearTable() {

    /* So let's delete all the current rows in the table from bottom to up */
    tblCustomers.find("tbody").empty();
}

function addCustomersToTable(startIndex, endIndex) {

    /* If we are in the last page then there is a good chance we don't have enough customer records to
    * full fill the whole page, so in such cases let's iterate until we hit the end of customer array */
    if (endIndex > customers.length) {
        endIndex = customers.length;
    }

    for (var i = startIndex; i < endIndex; i++) {

        /* Let's append a new row */
        // var row = tblCustomers.tBodies.item(0).insertRow(-1);

        // var row=tblCustomers.find("tbody").append("<tr></tr>");

        // if(i==0){
        //     row =tblCustomers.find("tbody tr:nth-child(0)");
        // }else{
        //     row =tblCustomers.find("tbody tr:nth-child("+i+1+")");
        // }
        // row.click(handleSelection());

        /* Let's add table data */
        var row=$("<tr></tr>");
        var customerIdTD=$("<td></td>");
        customerIdTD.text(customers[i].id);
        var customerNameTD=$("<td></td>");
        customerNameTD.text(customers[i].name);
        var customerAddressTD=$("<td></td>");
        customerAddressTD.text(customers[i].address)
        var customerDeleteButtonTD=$("<td><div class=\"trash\" onclick=\"handleDelete(event)\"></div></td>")

        row.append(customerIdTD);
        row.append(customerNameTD);
        row.append(customerAddressTD);
        row.append(customerDeleteButtonTD);
        tblCustomers.find("tbody").append(row);
        // row.click(handleSelection());

    }
}

function toggleBackwardForwardDisability(page) {

    /* If the page is the first most page then there is no point of having backward button */
    if (page == 1) {
        document.querySelector("#btn-backward").classList.add("disabled");
    } else {
        document.querySelector("#btn-backward").classList.remove("disabled");
    }

    /* If the page is the last most page then there is no point of having forward button */
    if (page == pageCount) {
        document.querySelector("#btn-forward").classList.add("disabled");
    } else {
        document.querySelector("#btn-forward").classList.remove("disabled");
    }
}

function clearSelection() {
    var rows = document.querySelectorAll("#tbl-customers tbody tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].classList.remove('selected');
    }
    txtId.disabled = false;
    selectedRow = null;
    selectedCustomer = null;
}

function handleSelection(event) {
    console.log("Hiii");
    console.log(event);
    clearSelection();
    selectedRow = event.target.parentElement;
    selectedRow.classList.add('selected');
    txtId.text(selectedRow.cells[0].innerText);
    txtId.disabled = true;
    txtName.text(selectedRow.cells[1].innerText);
    txtAddress.text(selectedRow.cells[2].innerText);
    selectedCustomer = customers.find(function (c) {
        return c.id === selectedRow.cells[0].innerText;
    });
}

// function handleDelete(event) {
//
//     if (confirm("Are you sure whether you want to delete this customer?")) {
//         /* Let's remove the customer from the array */
//         customers.splice(customers.findIndex(function (c) {
//             return c.id === event.target.parentElement.parentElement.cells[0].innerText;
//             // return c.id === $(event.target).parents("tr:first-child").text();
//         }), 1);
//
//         var activePage = +$(".pagination .active").text();
//         initPagination();
//         // renderPage(activePage ? activePage : 1);
//         showOrHideTFoot();
//
//         event.stopPropagation();
//     }
// }

function showOrHideTFoot() {
    if (tblCustomers.children("tbody tr").length > 0) {
        document.querySelector("#tbl-customers tfoot").classList.add('d-none');
    } else {
        document.querySelector("#tbl-customers tfoot").classList.remove('d-none');
    }
}

function handleInput(event) {
    this.classList.remove('is-invalid');
}

function validate() {
    /* Object Literal {}, Array Literal [], RegExp Literal /expression/ */
    /* new Object(), new Array(), new RegExp() */

    var regExp = null;
    var validated = true;

    txtId.removeClass('is-invalid');
    txtName.removeClass('is-invalid');
    txtAddress.removeClass('is-invalid');

    if (txtAddress.val().trim().length < 3) {
        txtAddress.addClass('is-invalid');
        txtAddress.select();
        validated = false;
    }

    regExp = /^[A-Za-z][A-Za-z .]{3,}$/;
    if (!regExp.test(txtName.val())) {
        txtName.addClass('is-invalid');
        txtName.select();
        validated = false;
    }

    regExp = /^C\d{3}$/;
    if (!regExp.test(txtId.val())) {
        txtId.addClass('is-invalid');
        $('helper-txt-id').removeClass('text-muted');
        $('helper-txt-id').addClass('invalid-feedback');
        txtId.select();
        validated = false;
    }

    /* Let's find whether duplicate ids are there */
    if (customers.findIndex(function (c) {
        return c.id === txtId.val()
    }) !== -1) {
        alert("Duplicate Customer IDs are not allowed");
        txtId.addClass('is-invalid');
        $('helper-txt-id').removeClass('text-muted');
        $('helper-txt-id').addClass('invalid-feedback');
        txtId.select();
        validated = false;
    }

    return validated;
}

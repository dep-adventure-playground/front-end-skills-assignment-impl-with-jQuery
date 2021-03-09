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
    txtId = document.getElementById('txt-id');
    txtName = document.getElementById('txt-name');
    txtAddress = document.getElementById('txt-address');
    tblCustomers = document.getElementById('tbl-customers');

    txtId.focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

document.getElementById('btn-save').addEventListener('click', handleSave);
document.addEventListener('click', handleClickEventDelegation);
txtId.addEventListener('input', handleInput)
txtName.addEventListener('input', handleInput)
txtAddress.addEventListener('input', handleInput)

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
            id: txtId.value,
            name: txtName.value,
            address: txtAddress.value
        });

        /* Let's initialize pagination */
        initPagination();
        renderPage(Math.ceil(customers.length / pageSize));
        showOrHideTFoot();

        /* Let's ready for next entry */
        txtId.value = '';
        txtName.value = '';
        txtAddress.value = '';
        txtId.focus();

    } else {

        /* There is a selected customer which means we need to update */
        selectedCustomer.name = txtName.value;
        selectedCustomer.address = txtAddress.value;
        selectedRow.cells[1].innerText = txtName.value;
        selectedRow.cells[2].innerText = txtAddress.value;
    }

}

function initPagination() {

    var paginationElm = document.querySelector("#pagination");

    /* Let's calculate the page size */
    pageSize = -1;
    clearTable();
    if (customers.length > 0) {

        /* First we need to check whether bootstrap has activated mobile styling  */
        if ((innerWidth < 992) && pageSize === -1) {
            pageSize = 6;
        } else {

            /* Let's add a temp row to the table so we can find out the row size */
            addCustomersToTable(0, 1);

            /* Let's get necessary coordinates and dimensions */
            var topPos = tblCustomers.tBodies[0].rows[0].getBoundingClientRect().top;
            var rowHeight = tblCustomers.tBodies[0].rows[0].clientHeight;
            var paginationHeight = paginationElm.clientHeight;
            var margin = 40;
            var i = 1;

            /* Let's find out the page size */
            do {
                var totalHeight = topPos + (rowHeight * i) + paginationHeight + margin;
                i++;
            } while (totalHeight < document.querySelector("footer").getBoundingClientRect().top);

            /* Since this do while loop, you gonna need to subtract two at the end */
            pageSize = i - 2;

            /* Let's remove the temp row that we added previously */
            clearTable();
        }
    }

    /* Let's calculate the page count */
    if (pageSize === -1) {
        pageCount = 1;
    } else {
        pageCount = Math.ceil(customers.length / pageSize);
    }

    /* Let's determine whether we display the pagination or not */
    if (pageCount > 1) {
        paginationElm.classList.remove("hidden");
    } else {
        paginationElm.classList.add('hidden');
    }

    if (endPageIndex === -1) {
        endPageIndex = pageCount;
        startPageIndex = endPageIndex - ((endPageIndex % MAX_PAGES) == 0 ? MAX_PAGES : (endPageIndex % MAX_PAGES));
    }

    var html = '<li class="page-item" id="btn-backward">' +
        '           <a class="page-link" href="#"><i class="fas fa-backward"></i></a>' +
        '       </li>';
    for (var i = 0; i < pageCount; i++) {
        if (i >= startPageIndex && i <= endPageIndex) {
            html += '<li class="page-item"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
        } else {
            html += '<li class="page-item d-none"><a class="page-link" href="#">' + (i + 1) + '</a></li>';
        }
    }
    html += '<li class="page-item" id="btn-forward">' +
        '          <a class="page-link" href="#"><i class="fas fa-forward"></i></a>' +
        '    </li>';
    document.querySelector(".pagination").innerHTML = html;
    endPageIndex = -1;
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
    var exActivePage = document.querySelector("#pagination .page-item.active");
    if (exActivePage !== null) {
        exActivePage.classList.remove('active');
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

    document.querySelector('.pagination li:nth-child(' + (page + 1) + ')').classList.add('active');

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
    for (var i = tblCustomers.tBodies[0].rows.length - 1; i >= 0; i--) {
        tblCustomers.tBodies[0].deleteRow(i);
    }
}

function addCustomersToTable(startIndex, endIndex) {

    /* If we are in the last page then there is a good chance we don't have enough customer records to
    * full fill the whole page, so in such cases let's iterate until we hit the end of customer array */
    if (endIndex > customers.length) {
        endIndex = customers.length;
    }

    for (var i = startIndex; i < endIndex; i++) {

        /* Let's append a new row */
        var row = tblCustomers.tBodies.item(0).insertRow(-1);
        row.onclick = handleSelection;

        /* Let's add table data */
        row.insertCell(0).innerText = customers[i].id;
        row.insertCell(1).innerText = customers[i].name;
        row.insertCell(2).innerText = customers[i].address;
        row.insertCell(3).innerHTML = '<div class="trash" onclick="handleDelete(event)"></div>';
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
    clearSelection();
    selectedRow = event.target.parentElement;
    selectedRow.classList.add('selected');
    txtId.value = selectedRow.cells[0].innerText;
    txtId.disabled = true;
    txtName.value = selectedRow.cells[1].innerText;
    txtAddress.value = selectedRow.cells[2].innerText;
    selectedCustomer = customers.find(function (c) {
        return c.id === selectedRow.cells[0].innerText;
    });
}

function handleDelete(event) {

    if (confirm("Are you sure whether you want to delete this customer?")) {

        /* Let's remove the customer from the array */
        customers.splice(customers.findIndex(function (c) {
            return c.id === event.target.parentElement.parentElement.cells[0].innerText;
        }), 1);

        var activePage = +document.querySelector(".pagination .active").innerText;
        initPagination();
        renderPage(activePage ? activePage : 1);
        showOrHideTFoot();

        event.stopPropagation();
    }
}

function showOrHideTFoot() {
    if (tblCustomers.tBodies.item(0).rows.length > 0) {
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

    txtId.classList.remove('is-invalid');
    txtName.classList.remove('is-invalid');
    txtAddress.classList.remove('is-invalid');

    if (txtAddress.value.trim().length < 3) {
        txtAddress.classList.add('is-invalid');
        txtAddress.select();
        validated = false;
    }

    regExp = /^[A-Za-z][A-Za-z .]{3,}$/;
    if (!regExp.test(txtName.value)) {
        txtName.classList.add('is-invalid');
        txtName.select();
        validated = false;
    }

    regExp = /^C\d{3}$/;
    if (!regExp.test(txtId.value)) {
        txtId.classList.add('is-invalid');
        document.getElementById('helper-txt-id').classList.remove('text-muted');
        document.getElementById('helper-txt-id').classList.add('invalid-feedback');
        txtId.select();
        validated = false;
    }

    /* Let's find whether duplicate ids are there */
    if (customers.findIndex(function (c) {
        return c.id === txtId.value
    }) !== -1) {
        alert("Duplicate Customer IDs are not allowed");
        txtId.classList.add('is-invalid');
        document.getElementById('helper-txt-id').classList.remove('text-muted');
        document.getElementById('helper-txt-id').classList.add('invalid-feedback');
        txtId.select();
        validated = false;
    }

    return validated;
}

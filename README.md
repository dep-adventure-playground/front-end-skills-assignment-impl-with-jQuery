# Front End Skills Test Assignment

This is a simple assignment to test your front end skills of technologies like HTML, CSS, SCSS,
ECMAScript, TypeScript, DOM, Webpack, etc.

### Prerequisites

* [Sass](https://sass-lang.com/)
* [NPM](https://nodejs.org/en/)

### How do I take this assignment?

* Clone the project first.
`git clone https://github.com/Direct-Entry-Program/front-end-skills-test-assignment.git`
* Run the `npm install` to install all required dependencies.
* Set up a file watcher to watch changes in Sass files and compile them to CSS automatically or open the terminal in the project directory and execute `sass scss:css --watch` (make sure not to close the terminal window otherwise sass won't watch for any file changes)
* That is it, you are good to go! 😉

### Guidelines for the assignment

* As soon as the page finished loading, the Customer ID text field should be focused.
* All the text fields should be validated as below otherwise it is not allowed to save.
    1. Customer ID should follow the pattern CXXX, where the X is a number between 0 and 9.
    2. Customer Name can only contain capital or simple alphabetical letters, spaces and periods. 
    3. Names like "**II-Parakrama Bahu**" are not allowed. 😉
    4. Customer Name and Customer Address can't be empty and at least should have three letters (do not count white spaces)
* If any of above validation fails, user should be notified about it by doing followings
    1. Showing a small helper text underneath the invalidated filed.
    2. Changing the border color of invalidate filed to red.
    3. Lastly, focus should go to the invalidated text field with the content selected. (If there are multiple invalid fields focus should go to the first invalidated text field)
* If all the text fields are valid, then it should be added to the table if it is a new record, otherwise it should update the existing record.
* The visibility of the table footer should follow the formula `tfoot visibility = (row count of table > 0)`
* The pagination should only visible when the table height is about to overlap the **Footer**.
* The pagination element should follow the following guidelines.
    1. The active page should be highlighted.
    2. If there are no forward or backward pages then appropriate button should be disabled.
    3. Once the records exceed the current page capacity, a new page should be added and active automatically (when adding a new customer).
    4. When there are no records in a page, it should delete automatically and active the next available page (when deleting)
* The table related guidelines,
    1. First and last columns' content should be aligned to center.
    2. The last column of every record should contain the [trash icon](img/trash.png) which is used to remove the record.
        * The original trash icons are very large, so you need to resize them to 32x32 via Scss
    3. When hovering on a last column data, the trash icon should be changed from [trash icon](img/trash.png) to [trash hover icon](img/trash-hover.png).
    4. When the user clicks on a trash icon, a message should be appeared asking to confirm the deletion. Only upon the confirmation, the record should be removed, otherwise nothing will happen.
    5. If the user selects a record, it should be visible to the user (either by changing the background color or border color of the row)
    6. When hovering on records, the mouse cursor should be changed to the hand so user knows this can be selected. 
    7. Upon selection, the selected record's data should be appeared in the appropriate text fields.
        * Customer ID text field should be disabled in this case because the user not allowed to change the Customer ID even though he/she can change the Customer Name and Customer Address  
* If the user clicks on the clear button all the text fields should be cleared (by default) and any selection that has been made previously on the table should be cleared as well. 

### FAQ

**Can I change the default HTML structure of the index.html?**

Of course. You may add as much as code you want or reposition code fragments accordingly, but you are not allowed to remove any elements of the default HTML structrure of the index.html

**Is it okay to change the default style.scss file as per my wish?**

Feel free ma boys and girls. This is all yours.

### Contributing

If you have suggestions to improve this assignment, feel free to drop an [email](mailto:suranga@ijse.lk) to me.

### License

Copyright © 2020 IJSE. All rights reserved.
Licensed under the [WTFPL](LICENSE) license.
 

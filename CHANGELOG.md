## 1.3.2

* [FIX] Don't treat \`\|\` (backticked pipes) as a table cell


## 1.3.1

* [NEW] Option to disable the formatter


## 1.3.0

The extensions was rewritten to take advantage of the Formatter provider VSCode offers.

* [REPLACED] Format on save
    - Now it uses the config provided by VSCode
* [REPLACED] Auto Select Entire Document
    - Now registers a formatter provider for entire document and for selection
* [FIX] Sometimes, when formatting, a line was wrongly added.


## 1.2.0

* [NEW] Format on save


## 1.0.1

* [FIX] Removed code for 'format on save', feature not ready.


## 1.0.0

* First version
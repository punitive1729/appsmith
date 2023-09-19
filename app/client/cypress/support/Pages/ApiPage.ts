import { ObjectsRegistry } from "../Objects/Registry";

type RightPaneTabs = "datasources" | "connections";

export class ApiPage {
  public agHelper = ObjectsRegistry.AggregateHelper;
  public locator = ObjectsRegistry.CommonLocators;
  private assertHelper = ObjectsRegistry.AssertHelper;

  private _createapi = ".t--createBlankApiCard";
  _resourceUrl = ".t--dataSourceField";
  private _headerKey = (index: number) =>
    ".t--actionConfiguration\\.headers\\[" +
    index +
    "\\]\\.key\\." +
    index +
    "";
  private _headerValue = (index: number) =>
    ".t--actionConfiguration\\.headers\\[" +
    index +
    "\\]\\.value\\." +
    index +
    "";
  private _paramKey = (index: number) =>
    ".t--actionConfiguration\\.queryParameters\\[" +
    index +
    "\\]\\.key\\." +
    index +
    "";
  public _paramValue = (index: number) =>
    ".t--actionConfiguration\\.queryParameters\\[" +
    index +
    "\\]\\.value\\." +
    index +
    "";
  private _importedKey = (index: number, keyValueName: string) =>
    `.t--${keyValueName}-key-${index}`;
  private _importedValue = (index: number, keyValueName: string) =>
    `.t--${keyValueName}-value-${index}`;
  _bodyKey = (index: number) =>
    ".t--actionConfiguration\\.bodyFormData\\[0\\]\\.key\\." + index + "";
  _bodyValue = (index: number) =>
    `.t--actionConfiguration\\.bodyFormData\\[${index}\\]\\.value\\.${index}`;
  _bodyTypeDropdown =
    "//span[text()='Type'][@class='rc-select-selection-placeholder']/ancestor::div";
  _apiRunBtn = ".t--apiFormRunBtn";
  private _queryTimeout =
    "//input[@name='actionConfiguration.timeoutInMillisecond']";
  _responseBody = ".CodeMirror-code  span.cm-string.cm-property";
  private _blankAPI = "span:contains('New blank API')";
  private _apiVerbDropdown = ".t--apiFormHttpMethod div";
  private _verbToSelect = (verb: string) =>
    "//div[contains(@class, 'rc-select-item-option')]//div[contains(text(),'" +
    verb +
    "')]";
  private _bodySubTab = (subTab: string) =>
    `//div[@data-testid="t--api-body-tab-switch"]//span[text()='${subTab}']`;
  private _rightPaneTab = (tab: string) =>
    "//span[contains(text(), '" + tab + "')]/parent::button";
  _visibleTextSpan = (spanText: string) => "//span[text()='" + spanText + "']";
  _visibleTextDiv = (divText: string) => "//div[text()='" + divText + "']";
  _noBodyMessageDiv = "#NoBodyMessageDiv";
  _noBodyMessage = "This request does not have a body";
  _imageSrc = "//img/parent::div";
  private _trashDelete = "[data-testid=t--trash-icon]";
  private _onPageLoad = "input[name='executeOnLoad'][type='checkbox']";
  private _confirmBeforeRunning =
    "input[name='confirmBeforeExecute'][type='checkbox']";
  private _paginationTypeLabels = ".t--apiFormPaginationType label";
  _saveAsDS = ".t--store-as-datasource";
  _responseStatus = ".t--response-status-code";
  private _importedDataButton = ".t--show-imported-datas";
  public _responseTabHeader = "[data-testid=t--tab-headers]";
  public _autoGeneratedHeaderInfoIcon = (key: string) =>
    `.t--auto-generated-${key}-info`;
  private _createQuery = ".t--create-query";
  _nextCursorValue = ".t--apiFormPaginationNextCursorValue";
  _fileOperation = "[data-testid='t--file-operation']";
  _addMore = ".t--addApiHeader";
  public _editorDS = ".t--datasource-editor";
  public _addMoreHeaderFieldButton = ".t--addApiHeader";
  public jsonBody = `.t--apiFormPostBody`;

  CreateApi(
    apiName = "",
    apiVerb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    aftDSSaved = false,
  ) {
    if (aftDSSaved) this.agHelper.GetNClick(this._createQuery);
    else {
      this.agHelper.RemoveEvaluatedPopUp();
      this.agHelper.GetHoverNClick(this.locator._createNew);
      this.agHelper.GetNClick(this._blankAPI, 0, true);
      this.agHelper.RemoveTooltip("Add a new query/JS Object");
    }
    this.assertHelper.AssertNetworkStatus("@createNewApi", 201);

    // cy.get("@createNewApi").then((response: any) => {
    //     expect(response.response.body.responseMeta.success).to.eq(true);
    //     cy.get(this.agHelper._actionName)
    //         .click()
    //         .invoke("text")
    //         .then((text) => {
    //             const someText = text;
    //             expect(someText).to.equal(response.response.body.data.name);
    //         });
    // }); // to check if Api1 = Api1 when Create Api invoked

    if (apiName) this.agHelper.RenameWithInPane(apiName);
    cy.get(this._resourceUrl).should("be.visible");
    if (apiVerb != "GET") this.SelectAPIVerb(apiVerb);
  }

  CreateAndFillApi(
    url: string,
    apiName = "",
    queryTimeout = 10000,
    apiVerb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" = "GET",
    aftDSSaved = false,
  ) {
    this.CreateApi(apiName, apiVerb, aftDSSaved);
    this.EnterURL(url);
    this.agHelper.Sleep(2000); // Added because api name edit takes some time to reflect in api sidebar after the call passes.
    this.AssertRunButtonDisability();
    if (queryTimeout != 10000) this.SetAPITimeout(queryTimeout);
  }

  AssertRunButtonDisability(disabled = false) {
    this.agHelper.AssertElementEnabledDisabled(this._apiRunBtn, 0, disabled);
  }

  EnterURL(url: string, evaluatedValue = "") {
    this.agHelper.EnterValue(url, {
      propFieldName: this._resourceUrl,
      directInput: true,
      inputFieldName: "",
      apiOrQuery: "api",
    });
    //this.agHelper.GetNClick(this._resourceUrl);
    this.agHelper.Sleep();
    if (evaluatedValue) {
      this.agHelper.VerifyEvaluatedValue(evaluatedValue);
    }
  }

  EnterHeader(hKey: string, hValue: string, index = 0) {
    this.SelectPaneTab("Headers");
    this.agHelper.EnterValue(hKey, {
      propFieldName: this._headerKey(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.EnterValue(hValue, {
      propFieldName: this._headerValue(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.AssertAutoSave();
  }

  EnterParams(pKey: string, pValue: string, index = 0, escape = true) {
    this.SelectPaneTab("Params");
    this.agHelper.EnterValue(pKey, {
      propFieldName: this._paramKey(index),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.EnterValue(pValue, {
      propFieldName: this._paramValue(index),
      directInput: true,
      inputFieldName: "",
    });
    if (escape) {
      this.agHelper.PressEscape();
    }
    this.agHelper.AssertAutoSave();
  }

  EnterBodyFormData(
    subTab: "FORM_URLENCODED" | "MULTIPART_FORM_DATA",
    bKey: string,
    bValue: string,
    type = "",
    toTrash = false,
  ) {
    this.SelectPaneTab("Body");
    this.SelectSubTab(subTab);
    if (toTrash) {
      cy.get(this._trashDelete).first().click();
      cy.xpath(this._visibleTextSpan("Add more")).click();
    }
    this.agHelper.EnterValue(bKey, {
      propFieldName: this._bodyKey(0),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();

    if (type) {
      cy.xpath(this._bodyTypeDropdown).eq(0).click();
      cy.xpath(this._visibleTextDiv(type)).click();
    }
    this.agHelper.EnterValue(bValue, {
      propFieldName: this._bodyValue(0),
      directInput: true,
      inputFieldName: "",
    });
    this.agHelper.PressEscape();
    this.agHelper.AssertAutoSave();
  }

  RunAPI(
    toValidateResponse = true,
    waitTimeInterval = 20,
    validateNetworkAssertOptions?: { expectedPath: string; expectedRes: any },
  ) {
    this.agHelper.GetNClick(this._apiRunBtn, 0, true, waitTimeInterval);
    toValidateResponse &&
      this.assertHelper.AssertNetworkExecutionSuccess("@postExecute");

    // Asserting Network result
    validateNetworkAssertOptions?.expectedPath &&
      validateNetworkAssertOptions?.expectedRes &&
      this.agHelper.AssertNetworkDataNestedProperty(
        "@postExecute",
        validateNetworkAssertOptions.expectedPath,
        validateNetworkAssertOptions.expectedRes,
      );
  }

  SetAPITimeout(timeout: number) {
    this.SelectPaneTab("Settings");
    cy.xpath(this._queryTimeout).clear().type(timeout.toString(), { delay: 0 }); //Delay 0 to work like paste!
    this.agHelper.AssertAutoSave();
    this.SelectPaneTab("Headers");
  }

  ToggleOnPageLoadRun(enable = true || false) {
    this.SelectPaneTab("Settings");
    if (enable) this.agHelper.CheckUncheck(this._onPageLoad, true);
    else this.agHelper.CheckUncheck(this._onPageLoad, false);
  }

  ToggleConfirmBeforeRunning(enable = true || false) {
    this.SelectPaneTab("Settings");
    if (enable) this.agHelper.CheckUncheck(this._confirmBeforeRunning, true);
    else this.agHelper.CheckUncheck(this._confirmBeforeRunning, false);
  }

  SelectPaneTab(
    tabName:
      | "Headers"
      | "Params"
      | "Body"
      | "Pagination"
      | "Authentication"
      | "Settings"
      | "Response"
      | "Errors"
      | "Logs"
      | "Inspect entity",
  ) {
    this.agHelper.PressEscape();
    this.agHelper.GetNClick(this._visibleTextSpan(tabName), 0, true);
  }

  SelectSubTab(
    subTabName:
      | "NONE"
      | "JSON"
      | "FORM_URLENCODED"
      | "MULTIPART_FORM_DATA"
      | "RAW",
  ) {
    this.agHelper.GetNClick(this._bodySubTab(subTabName));
  }

  AssertRightPaneSelectedTab(tabName: RightPaneTabs) {
    cy.xpath(this._rightPaneTab(tabName)).should(
      "have.attr",
      "aria-selected",
      "true",
    );
  }

  SelectRightPaneTab(tabName: RightPaneTabs) {
    this.agHelper.GetNClick(this._rightPaneTab(tabName));
  }

  ValidateQueryParams(param: { key: string; value: string }) {
    this.SelectPaneTab("Params");
    this.agHelper.ValidateCodeEditorContent(this._paramKey(0), param.key);
    this.agHelper.ValidateCodeEditorContent(this._paramValue(0), param.value);
  }

  ValidateHeaderParams(header: { key: string; value: string }, index = 0) {
    this.SelectPaneTab("Headers");
    this.agHelper.ValidateCodeEditorContent(this._headerKey(index), header.key);
    this.agHelper.ValidateCodeEditorContent(
      this._headerValue(index),
      header.value,
    );
  }

  ValidateImportedHeaderParams(
    isAutoGeneratedHeader = false,
    header: { key: string; value: string },
    index = 0,
  ) {
    let keyValueName = "Header";
    if (isAutoGeneratedHeader) {
      keyValueName = "autoGeneratedHeader";
    }

    this.SelectPaneTab("Headers");
    this.ValidateImportedKeyValueContent(
      this._importedKey(index, keyValueName),
      header.key,
    );
    this.ValidateImportedKeyValueContent(
      this._importedValue(index, keyValueName),
      header.value,
    );
  }

  public ValidateImportedKeyValueContent(
    selector: string,
    contentToValidate: any,
  ) {
    this.agHelper.GetNAssertElementText(
      selector,
      contentToValidate,
      "have.text",
    );
  }

  public ValidateImportedKeyValueOverride(index: number, isOverriden = true) {
    let assertion = "";

    if (isOverriden) {
      assertion = "have.css";
    } else {
      assertion = "not.have.css";
    }
    cy.get(this._importedKey(index, "autoGeneratedHeader")).should(
      assertion,
      "text-decoration",
      "line-through solid rgb(76, 86, 100)",
    );
    cy.get(this._importedValue(index, "autoGeneratedHeader")).should(
      assertion,
      "text-decoration",
      "line-through solid rgb(76, 86, 100)",
    );
  }

  ValidateImportedHeaderParamsAbsence(
    isAutoGeneratedHeader = false,
    index = 0,
  ) {
    let keyValueName = "Header";
    if (isAutoGeneratedHeader) {
      keyValueName = "autoGeneratedHeader";
    }

    this.SelectPaneTab("Headers");
    this.ValidateImportedKeyValueAbsence(
      this._importedKey(index, keyValueName),
    );
    this.ValidateImportedKeyValueAbsence(
      this._importedValue(index, keyValueName),
    );
  }

  public ValidateImportedKeyValueAbsence(selector: string) {
    this.agHelper.AssertElementAbsence(selector);
  }

  ReadApiResponsebyKey(key: string) {
    let apiResp = "";
    cy.get(this._responseBody)
      .contains(key)
      .siblings("span")
      .invoke("text")
      .then((text) => {
        apiResp = `${text
          .match(/"(.*)"/)?.[0]
          .split('"')
          .join("")} `;
        cy.log("Key value in api response is :" + apiResp);
        cy.wrap(apiResp).as("apiResp");
      });
  }

  SwitchToResponseTab(tabIdentifier: string) {
    cy.get(tabIdentifier).click();
  }

  public SelectAPIVerb(verb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") {
    cy.get(this._apiVerbDropdown).click();
    cy.xpath(this._verbToSelect(verb)).should("be.visible").click();
  }

  public AssertAPIVerb(verb: "GET" | "POST" | "PUT" | "DELETE" | "PATCH") {
    this.agHelper.AssertText(this._apiVerbDropdown, "text", verb);
  }

  ResponseStatusCheck(statusCode: string) {
    this.agHelper.AssertElementVisibility(this._responseStatus);
    this.agHelper.GetNAssertContains(this._responseStatus, statusCode);
  }
  public SelectPaginationTypeViaIndex(index: number) {
    cy.get(this._paginationTypeLabels).eq(index).click({ force: true });
  }

  CreateAndFillGraphqlApi(url: string, apiName = "", queryTimeout = 10000) {
    this.CreateGraphqlApi(apiName);
    this.EnterURL(url);
    this.agHelper.AssertAutoSave();
    //this.agHelper.Sleep(2000);// Added because api name edit takes some time to reflect in api sidebar after the call passes.
    this.AssertRunButtonDisability();
    if (queryTimeout != 10000) this.SetAPITimeout(queryTimeout);
  }

  CreateGraphqlApi(apiName = "") {
    cy.get(this.locator._createNew).click({ force: true });
    this.agHelper.GetNClickByContains(
      this._fileOperation,
      "New blank GraphQL API",
    );
    this.assertHelper.AssertNetworkStatus("@createNewApi", 201);

    if (apiName) this.agHelper.RenameWithInPane(apiName);
    cy.get(this._resourceUrl).should("be.visible");
  }

  AssertEmptyHeaderKeyValuePairsPresent(index: number) {
    this.agHelper.AssertElementVisibility(this._headerKey(index));
    this.agHelper.AssertElementVisibility(this._headerValue(index));
  }
}

define("launchpad/lib/accounts/accounts-model",["jquery","angular","launchpad/lib/common/util","launchpad/lib/accounts/accounts-module"],function(e,g,h,l){l.factory("AccountsModel",["$rootScope","customerId","accountsTimeout","groupsTimeout","httpService","$q",function(e,k,c,m,n,f){var d=function(a){var b=this;this.accountsModel=n.getInstance({endpoint:a.accountsEndpoint,cacheTimeout:c,urlVars:{partyId:k}});if(this.groupsEnabled=!!a.groupsEndpoint)this.groupsService=n.getInstance({endpoint:a.groupsEndpoint,
cacheTimeout:m});this.accounts=null;this.error=!1;gadgets.pubsub.subscribe("launchpad-retail:ACCOUNT_BALANCE_CHANGED",function(a){null!==b.accounts&&b.load()})};d.prototype.load=function(){var a=this,b=function(b){b.errors&&(a.error=b.errors[0].code)};return this.groupsEnabled?f.all([a.accountsModel.read(null,!0),a.groupsService.read(null,!0)]).then(function(b){a.refreshAccounts(b[0].data);a.fixAccounts();a.groups=b[1].data},b):a.accountsModel.read().success(function(b){a.refreshAccounts(b);a.fixAccounts()}).error(b)};
d.prototype.findById=function(a){return this.accounts.filter(function(b){return b.id===a})[0]};d.prototype.findByAccountNumber=function(a){return this.accounts.filter(function(b){return b.bban===a})[0]};d.prototype.getPending=function(a){return a.balance-a.availableBalance};d.prototype.getGroupSize=function(a){for(var b=0,d=0;d<this.accounts.length;d++)this.accounts[d].groupCode===a.code&&b++;return b};d.prototype.configurePreviousBalanceDeltas=function(a){var b=this;b.previousBalances?g.forEach(a,
function(a){a.delta=b.previousBalances[a.id]>a.availableBalance?-1:b.previousBalances[a.id]<a.availableBalance?1:0}):(b.previousBalances=[],g.forEach(a,function(a){a.delta=0}));g.forEach(a,function(a){b.previousBalances[a.id]=a.availableBalance});return a};d.prototype.refreshAccounts=function(a){this.accounts=a=this.configurePreviousBalanceDeltas(a)};d.prototype.getGroupTotal=function(a){for(var b,d=0,c,f=0;f<this.accounts.length;f++)b=this.accounts[f],b.groupCode===a.code&&(d+=b.balance,c=b.currency);
return{totalBalance:d,currency:c}};d.prototype.fixAccounts=function(){for(var a,b=0;b<this.accounts.length;b++)a=this.accounts[b],a.balance=parseFloat(a.balance),a.availableBalance=parseFloat(a.availableBalance)};return{getInstance:function(a){return new d(a)}}}])});define("launchpad/lib/accounts/accounts-select","jquery angular launchpad/lib/accounts/accounts-module launchpad/support/angular/angular-ui-bootstrap launchpad/lib/ui launchpad/lib/i18n launchpad/lib/transactions".split(" "),function(e,g,h){h.directive("lpFormatAmount",["$parse","i18nUtils","widget",function(e,g,k){return{restrict:"A",scope:{account:"\x3dlpFormatAmount"},link:function(c,m,e){c.$watch("account",function(f){var d=[];d.available=f.availableBalance;d.current=f.balance;var a=k.getPreferenceFromParents("preferredBalanceView")||
"current";f=g.formatAmount(c.locale,d[a],f.currency);m.html(f)})}}}]);h.directive("lpAccountsSelect",["i18nUtils","widget","$templateCache",function(e,h,k){k.put("$accountSelectTemplate.html",'\x3cdiv class\x3d"clearfix"\x3e\x3cdiv class\x3d"pull-left lp-acct-detail"\x3e\x3cdiv class\x3d"clearfix"\x3e\x3cdiv class\x3d"pull-left lp-acct-from"\x3e\x3cspan\x3eFrom\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"pull-left"\x3e\x3cdiv class\x3d"lp-acct-name"\x3e\x3cspan\x3e{{option.name}}\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"lp-acct-num"\x3e\x3csmall\x3eIBAN:\x3c/small\x3e \x3cspan lp-aria-number\x3d"option.iban"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"pull-right text-right"\x3e\x3cdiv class\x3d"h4 lp-account-amount"\x3e\x3cspan class\x3d"sr-only"\x3eAccount balance\x3c/span\x3e\x3cspan lp-format-amount\x3d"option" lp-balance-update\x3d"lp-balance-update" ng-model\x3d"option"\x3e\x3c/span\x3e\x3c/div\x3e\x3cdiv class\x3d"h6 lp-account-bal" ng-if\x3d"preferredBalance \x3d\x3d\x3d \'current\'"\x3e\x3csmall\x3eCurrent:\x3c/small\x3e \x3cspan lp-amount\x3d"option.balance" lp-amount-currency\x3d"option.currency"/\x3e\x3c/div\x3e\x3cdiv class\x3d"h6 lp-account-bal" ng-if\x3d"preferredBalance !\x3d\x3d \'current\'"\x3e\x3csmall\x3eAvailable:\x3c/small\x3e \x3cspan lp-amount\x3d"option.availableBalance" lp-amount-currency\x3d"option.currency"/\x3e\x3c/div\x3e\x3c/div\x3e');
return{restrict:"EA",replace:!0,require:"ngModel",scope:{lpAccounts:"\x3d"},template:'\x3cdiv class\x3d"lp-account-select"\x3e\x3cdropdown-select ng-model\x3d"model" ng-options\x3d"account as account for account in accounts"option-template-url\x3d"$accountSelectTemplate.html" ng-change\x3d"changed()" lp-responsive\x3d"lp-responsive" size-rules\x3d"responsiveRules" empty-placeholder-text\x3d"Select an account..."\x3e\x3c/dropdown-select\x3e\x3c/div\x3e',link:function(c,e,k,f){c.preferredBalance=h.getPreferenceFromParents("preferredBalanceView")||
"current";f.$render=function(){var d=f.$modelValue,a=c.accounts;d&&a&&0<a.length?g.forEach(a,function(a){d.id===a.id&&(c.model=a)}):c.model=null};c.changed=function(){f.$setViewValue(c.model)};c.formatDefaultText=function(d){return'\x3cdiv class\x3d"something"\x3e'+d+"\x3c/div\x3e"};c.$watch("lpAccounts",function(d){c.accounts=d||[];f.$render()});c.responsiveRules=[{max:300,size:"small-account-select"},{min:301,max:400,size:"normal-account-select"},{min:401,size:"large-account-select"}]}}}])});define("launchpad/lib/accounts/accounts-chart-model",["jquery","angular","launchpad/lib/common/util","launchpad/lib/accounts/accounts-module"],function(e,g,h,l){l.factory("AccountsChartModel",["$rootScope","httpService",function(e,g){var c=function(c){this.accountsChartModel=g.getInstance({endpoint:c.accountsChartEndpoint,urlVars:{accountId:c.accountId}});this.chartData=null;this.error=!1};c.prototype.load=function(c){var e=this;c=e.accountsChartModel.read(c).success(function(c){e.chartData=c});c.error(function(c){c.errors&&
(e.error=c.errors[0].code)});return c};return{getInstance:function(e){return new c(e)}}}])});define("launchpad/lib/accounts/accounts-module",["angular","launchpad/lib/common"],function(e){e=e.module("accounts",["common","i18n","ui.bootstrap","ui"]);e.value("groupsTimeout",6E5);e.value("accountsTimeout",1E4);e.value("customerId","3");return e});define(["launchpad/lib/accounts/accounts-module","launchpad/lib/accounts/accounts-chart-model","launchpad/lib/accounts/accounts-model","launchpad/lib/accounts/accounts-select"],function(e){return e});
//# sourceMappingURL=accounts.js.map
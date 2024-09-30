<!--
* description: 模板-表单
* logs:
-->
<template>
  <section class="filter-params-e3s fastForm">
    <el-form
      ref="ruleForm"
      :model="formData"
      :label-position="labelPosition"
      class="fastRuleForm"
      :class="{ 'fastRuleForm--inline': inlineMessage }"
      :inline-message="inlineMessage"
      @validate="handleValidateForm"
      @submit.native.prevent>
      <el-row>
        <el-col :span="24" style="margin-bottom: 0">
          <template v-for="(group, areaIndex) in pageAreas && pageAreas.length > 0 ? pageAreas : ['']">
            <slot :name="group" :areaIndex="areaIndex" :group="group">
              <div v-if="group" :key="areaIndex" class="filter-container filter-title">{{ group }}</div>
            </slot>
            <template
              v-for="item in fieldsComponents.filter(
                o => o.hidden !== true && (o.isMust === undefined || o.isMust === true) && (!group || o.group === group)
              )">
              <!-- 下拉框-->
              <el-col
                v-if="item.type === 'dropdownList'"
                v-show="item.isShow === false ? false : true"
                :key="`dropdownList_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth"
                  :id="item.type + '-' + item.compKey">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-select
                    v-if="item.type === 'dropdownList'"
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    :reserve-keyword="item.reserveKeyword || false"
                    :class="item.valFont ? 'font-Weight-red' : ''"
                    :disabled="item.disabled || false"
                    :popper-class="item.popClass"
                    :filterable="item.filterable || false"
                    :multiple="item.isMul || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请选择'
                    "
                    :clearable="item.clearable == false ? false : true"
                    :collapse-tags="item.collapseTags != false ? true : false"
                    size="small"
                    v-bind="useVBind ? item : {}"
                    @mouseover.native="compOnMouseOver(item)"
                    @mouseleave.native="compOnMouseLeave(item)"
                    @change="doChangeEvent(item.codeField, true, true, false, null, null, 'event')">
                    <el-option
                      v-for="(obj, i) in item.dataOptions.dataSource.options"
                      :key="`${item.codeField}_${i}`"
                      :label="obj.label || obj[item.newLabel]"
                      :value="obj.value || obj[item.newValue] || ''"
                      :disabled="obj.disabled" />
                  </el-select>
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <el-col
                v-else-if="item.type === 'inputSearch'"
                v-show="item.isShow === false ? false : true"
                :key="`inputSearch_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-autocomplete
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    :fetch-suggestions="item.querySearch"
                    :disabled="item.disabled || false"
                    :readonly="item.readonly || false"
                    :trigger-on-focus="item.triggerOnFocus || false"
                    :placeholder="item.disabled && item.alwaysShowPlaceholder !== true ? '' : '请输入内容'"
                    :class="['el-input-autocomplete', item.fieldClass]"
                    v-bind="useVBind ? item : {}"
                    @select="doChildEvent(item.select, { comp: item }, 'select')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 文本输入框-->
              <el-col
                v-else-if="item.type === 'inputTxt'"
                v-show="item.isShow === false ? false : true"
                :key="`inputTxt_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    :class="{
                      'font-Weight-red': item.valFont,
                      'text-align-center': item.align === 'center',
                      'text-align-right': item.align === 'right',
                    }"
                    :type="item.inputType"
                    :readonly="item.readonly || false"
                    :max="item.max"
                    :min="item.min"
                    :minlength="item.minlength"
                    :maxlength="item.maxlength"
                    :suffix-icon="item.suffixIcon"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    size="small"
                    :clearable="item.clearable == false ? false : true"
                    :disabled="item.disabled || false"
                    :show-password="item.inputType === 'password' && item.showPassword !== false"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')"
                    @clear="doChildEvent(item.clear, { comp: item }, 'clear')"
                    @keyup.enter.native="doChildEvent(item.enter, { comp: item }, 'enter')"
                    @paste.native.capture.prevent="doChildEvent(item.paste, { comp: item, e: $event }, 'paste')"
                    @input="doChildEvent(item.input, { comp: item }, 'input')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 日期输入框-->
              <el-col
                v-else-if="item.type === 'inputDate'"
                v-show="item.isShow === false ? false : true"
                :key="`inputDate_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-date-picker
                    v-model="formData[item.codeField]"
                    :type="item.dataOptions.dateType"
                    :value-format="item.dataOptions.valueFormat || item.dataOptions.format"
                    :format="item.dataOptions.format"
                    :clearable="item.clearable == false ? false : true"
                    :disabled="item.disabled || false"
                    :picker-options="item.pickerOptions || {}"
                    :editable="false"
                    :unlink-panels="true"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    :start-placeholder="'开始日期'"
                    :end-placeholder="'结束日期'"
                    :default-time="item.dataOptions.defaultTime"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')"
                    @clear="doChildEvent(item.clear, { comp: item }, 'clear')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 时间输入框-->
              <el-col
                v-else-if="item.type === 'inputTime'"
                v-show="item.isShow === false ? false : true"
                :key="`inputTime_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-time-picker
                    v-model="formData[item.codeField]"
                    :is-range="item.isRange"
                    :value-format="item.dataOptions.format"
                    :format="item.dataOptions.format"
                    :clearable="item.clearable == false ? false : true"
                    :disabled="item.disabled || false"
                    :picker-options="item.pickerOptions || {}"
                    :editable="false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    :start-placeholder="'开始时间'"
                    :end-placeholder="'结束时间'"
                    range-separator="至"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')"
                    @clear="doChildEvent(item.clear, { comp: item }, 'clear')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 开关-->
              <el-col
                v-else-if="item.type === 'switch'"
                v-show="item.isShow === false ? false : true"
                :key="`switch_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6"
                class="fast-switch">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-switch
                    v-model="formData[item.codeField]"
                    active-value="1"
                    inactive-value="0"
                    v-bind="useVBind ? item : {}"
                    @change="doChildEvent(item.change, { comp: item }, 'change')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 纯输入框-->
              <el-col
                v-else-if="item.type === 'inputTxt2'"
                v-show="item.isShow === false ? false : true"
                :key="`inputTxt2_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    :readonly="item.readonly || false"
                    :minlength="item.minlength"
                    :maxlength="item.maxlength"
                    :suffix-icon="item.suffixIcon || 'suffixIcon'"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    size="small"
                    :clearable="item.clearable == false ? false : true"
                    :disabled="item.disabled || false"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')"
                    @keyup.enter.native="doChildEvent(item.enter, { comp: item }, 'enter')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 带按钮的文本输入框-->
              <el-col
                v-else-if="item.type === 'inputWithBtn'"
                v-show="item.isShow === false ? false : true"
                :key="`inputWithBtn_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    class="btnSuffix"
                    :readonly="item.readonly || false"
                    :disabled="item.disabled || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请选择'
                    "
                    size="small"
                    :clearable="item.clearable == false ? false : true"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')">
                    <i
                      slot="suffix"
                      class="mix-icon el-icon-search"
                      @click="doChildEvent(item.click, { comp: item }, 'click')" />
                  </el-input>
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 带刷新按钮的文本输入框-->
              <el-col
                v-else-if="item.type === 'inputWithResetBtn'"
                v-show="item.isShow === false ? false : true"
                :key="`inputWithResetBtn_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    :readonly="item.readonly || false"
                    class="btnSuffix"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请选择'
                    "
                    size="small"
                    :clearable="item.clearable == false ? false : true"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')">
                    <i
                      slot="suffix"
                      class="mix-icon el-icon-refresh"
                      @click="doChildEvent(item.click, { comp: item }, 'click')" />
                  </el-input>
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 文本area输入框-->
              <el-col
                v-else-if="item.type === 'textarea'"
                v-show="item.isShow === false ? false : true"
                :key="`textarea_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    type="textarea"
                    :rows="item.rows || 1"
                    :readonly="item.readonly || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    :minlength="item.minlength"
                    :maxlength="item.maxlength"
                    size="small"
                    :disabled="item.disabled || false"
                    v-bind="useVBind ? item : {}"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 数字输入框-->
              <el-col
                v-else-if="item.type === 'inputNumber'"
                v-show="item.isShow === false ? false : true"
                :key="`inputNumber_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    type="number"
                    :readonly="item.readonly || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    size="small"
                    :disabled="item.disabled || false"
                    :min="item.min || 1"
                    :max="item.max !== undefined ? item.max : 1000000000"
                    :step="item.step || 1"
                    :clearable="item.clearable == false ? false : true"
                    v-bind="useVBind ? item : {}"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 数字区间输入框-->
              <el-col
                v-else-if="item.type === 'inputInterval'"
                v-show="item.isShow === false ? false : true"
                :key="`inputInterval_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :label-width="item.labelWidth"
                  class="fd-inputInterval">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-input
                    :ref="item.dataOptions.startField"
                    v-model="formData[item.dataOptions.startField]"
                    type="number"
                    :readonly="item.readonly || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    size="small"
                    :disabled="item.disabled || false"
                    :min="item.min || 1"
                    :max="item.max !== undefined ? item.max : 1000000000"
                    :step="item.step || 1"
                    :clearable="item.clearable == false ? false : true"
                    v-bind="useVBind ? item : {}"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')" />
                  <span class="fd-jg-line">-</span>
                  <el-input
                    :ref="item.dataOptions.endField"
                    v-model="formData[item.dataOptions.endField]"
                    type="number"
                    :readonly="item.readonly || false"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请输入'
                    "
                    size="small"
                    :disabled="item.disabled || false"
                    :min="item.min || 1"
                    :max="item.max !== undefined ? item.max : 1000000000"
                    :step="item.step || 1"
                    :clearable="item.clearable == false ? false : true"
                    v-bind="useVBind ? item : {}"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @blur="doChildEvent(item.blur, { comp: item }, 'blur')" />
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 多选输入框-->
              <el-col
                v-else-if="item.type === 'checkbox'"
                v-show="item.isShow === false ? false : true"
                :key="`checkbox_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  class="fd-checkbox"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-checkbox
                    v-for="(op, i) in item.option"
                    :key="i"
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    true-label="1"
                    false-label="0"
                    :disabled="item.disabled || false"
                    :label="op.label"
                    v-bind="useVBind ? item : {}"
                    @change="doChildEvent(item.change, { comp: item }, 'change')" />
                  <span class="checkBoxText">{{ item.checkBoxText }}</span>
                </el-form-item>
              </el-col>
              <!-- 多选组 checkboxGroup-->
              <el-col
                v-else-if="item.type === 'checkboxGroup'"
                v-show="item.isShow === false ? false : true"
                :key="`checkboxGroup_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  class="fd-checkboxGroup"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-checkbox-group
                    v-model="formData[item.codeField]"
                    @change="doChildEvent(item.change, { comp: item }, 'change')">
                    <el-checkbox
                      v-for="op in item.options"
                      :key="op[item.newValue] || op.value"
                      :label="op[item.newValue] || op.value"
                      :disabled="item.disabled || op.disabled || false"
                      v-bind="useVBind ? op : {}"
                      >{{ op[item.newLabel] || op.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <!--单选按钮-->
              <el-col
                v-else-if="item.type === 'radio'"
                v-show="item.isShow === false ? false : true"
                :key="`radio_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  class="fd-radio"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <el-radio
                    v-for="(op, i) in item.option"
                    :key="`${op.codeField}_${i}`"
                    :ref="item.codeField"
                    v-model="formData[item.codeField]"
                    true-label="1"
                    false-label="0"
                    :label="op.value"
                    :disabled="item.disabled || op.disabled || false"
                    v-bind="useVBind ? op : {}"
                    @change="doChangeEvent(item.codeField, true, true, false, null, null, 'event')"
                    >{{ op.label }}</el-radio
                  >
                  <span class="radioText">{{ item.radioText }}</span>
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!--单选按钮组-->
              <el-col
                v-else-if="item.type === 'radioGroup' || item.type === 'radioButtonGroup'"
                v-show="item.isShow === false ? false : true"
                :key="`radioGroup_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  class="fd-radioGroup"
                  :label-width="item.labelWidth">
                  <span slot="label" @mouseenter="showLabel(item)" @mouseleave="hideLabel(item)">{{
                    item.labelName
                  }}</span>
                  <template v-if="item.type === 'radioGroup'">
                    <el-radio
                      v-for="(op, i) in item.options"
                      :key="`${op.codeField}_${i}`"
                      :ref="item.codeField"
                      v-model="formData[item.codeField]"
                      :label="op[item.newValue] || op.value"
                      :disabled="item.disabled || op.disabled || false"
                      v-bind="useVBind ? op : {}"
                      @change="doChildEvent(item.change, { comp: item }, 'change')">
                      {{ op[item.newLabel] || op.label }}
                    </el-radio>
                  </template>
                  <template v-if="item.type === 'radioButtonGroup'">
                    <el-radio-group v-model="formData[item.codeField]">
                      <el-radio-button
                        v-for="(op, i) in item.options"
                        :key="`${op.codeField}_${i}`"
                        :ref="item.codeField"
                        :label="op[item.newValue] || op.value"
                        :disabled="item.disabled || op.disabled || false"
                        v-bind="useVBind ? op : {}"
                        @change="doChildEvent(item.change, { comp: item }, 'change')">
                        {{ op[item.newLabel] || op.label }}
                      </el-radio-button>
                    </el-radio-group>
                  </template>
                </el-form-item>
                <span v-show="item.showLabel" class="ellipsisshowName">{{ item.labelName }}<i /></span>
              </el-col>
              <!-- 纯文字备注-->
              <el-col
                v-else-if="item.type === 'text'"
                v-show="item.isShow === false ? false : true"
                :key="`text_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item :prop="item.codeField" :rules="item.isShow !== false ? handleRules(item.rules) : []">
                  <span
                    :ref="item.codeField"
                    true-label="1"
                    false-label="0"
                    :disabled="item.disabled || false"
                    v-bind="useVBind ? item : {}"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    >{{ item.labelName }}</span
                  >
                </el-form-item>
              </el-col>
              <!-- a -->
              <el-col
                v-else-if="item.type === 'link'"
                v-show="item.isShow === false ? false : true"
                :key="`link_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item :prop="item.codeField" class="fd-link">
                  <el-link
                    class="cursor"
                    :icon="item.icon"
                    :disabled="item.disabled || false"
                    v-bind="useVBind ? item : {}"
                    @click="doChildEvent(item.click, { comp: item }, 'click')"
                    >{{ item.labelName }}
                  </el-link>
                </el-form-item>
              </el-col>
              <!-- label文本 -->
              <el-col
                v-else-if="item.type === 'label'"
                v-show="item.isShow === false ? false : true"
                :key="`label_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 2"
                :class="item.class">
                <el-form-item :prop="item.codeField" class="fd-label">
                  <div>{{ item.labelName }}</div>
                </el-form-item>
              </el-col>
              <!-- 外部自定义组件-->
              <el-col
                v-else-if="item.isComponent"
                v-show="item.isShow === false ? false : true"
                :key="`fields_${areaIndex}_${item.codeField + item.compKey}`"
                :class="'fd-col-' + item.type + ' ' + (item.class || '')"
                :span="item.span || 6">
                <el-form-item
                  :prop="item.codeField"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []"
                  :class="'fd-comp-' + item.type"
                  :label-width="handleCompLabelWidth(item)">
                  <span
                    v-if="useElFormItemLabel(item)"
                    slot="label"
                    @mouseenter="showLabel(item)"
                    @mouseleave="hideLabel(item)"
                    >{{ item.labelName }}</span
                  >
                  <component
                    :is="item.component"
                    :key="item.compKey"
                    :ref="item.codeField"
                    :code-field="item.codeField"
                    :text-field="item.textField"
                    :label-name="useElFormItemLabel(item) ? '' : item.labelName"
                    :data-to-object="{
                      ...item.dataToObject,
                      ...(item.dataOptions ? item.dataOptions.dataToObject : {}),
                      dataOptions: item.dataOptions,
                    }"
                    :lookuptype="item.lookuptype"
                    :format="item.format"
                    :date-type="item.dateType"
                    :clearable="item.clearable"
                    :is-show="item.isShow"
                    :disabled="item.disabled"
                    :filterable="item.filterable"
                    :label-width="
                      useElFormItemLabel(item) ? 0 : item.labelWidth ? parseInt(item.labelWidth) : item.labelWidth
                    "
                    :is-show-label="useElFormItemLabel(item) ? false : true"
                    :max-word-count="item.maxWordCount || 6"
                    :is-mul="item.isMul"
                    :is-require="
                      item.isRequireType === 'custom' && item.rules && item.rules.length > 0 && item.rules[0].required
                    "
                    :class="item.class"
                    :span="24"
                    :is-input="true"
                    :code="formData[item.codeField]"
                    :text="formData[item.textField]"
                    :form-data="formData"
                    :placeholder="
                      item.disabled && item.alwaysShowPlaceholder !== true ? '' : item.placeholder || '请选择'
                    "
                    :is-fast-designer="getIsFastDesigner(item)"
                    :is-tags="item.collapseTags != false ? true : false"
                    @changeCode="getComponentData"
                    @click="doChildEvent(item.click, { comp: item }, 'click')"
                    @change="doChildEvent(item.change, { comp: item }, 'change')"
                    @focus="doChildEvent(item.focus, { comp: item }, 'focus')"
                    @hook:mounted="componentHookChange('mounted', item)" />
                </el-form-item>
              </el-col>
              <el-col
                v-else-if="item.type === 'slot'"
                v-show="item.isShow === false ? false : true"
                :key="`slot_${areaIndex}_${item.codeField + item.compKey}`"
                :span="item.span || 6">
                <slot
                  :name="item.codeField"
                  :item="item"
                  :slotFormData="formData"
                  :rules="item.isShow !== false ? handleRules(item.rules) : []" />
              </el-col>
            </template>
          </template>
          <fast-button
            v-if="dynamicBtns.length > 0"
            ref="fastForm-fastButton"
            :is-show-config-btn="isShowConfigBtn"
            :is-show-more="isShowMore"
            :is-show-oper-inst="isShowOperInst"
            :is-show-full-screen="isShowFullScreen"
            :view-page-code="viewPageCode"
            :form-ref="formRef"
            :table-ref="tableRef"
            :dynamic-form-fields="dynamicFormFields"
            :dynamic-table-options="dynamicTableOptions"
            :dynamic-btns="dynamicBtns"
            :expand-btn-count="expandBtnCount"
            :button-ref-index="buttonRefIndex"
            :expand-btn-span="expandBtnSpan"
            :refurbish-mode="refurbishMode">
            <div slot="right-left-control" class="fastform-slot-rl">
              <slot name="right-left-control" />
            </div>
            <div slot="right-right-control" class="fastform-slot-rr">
              <slot name="right-right-control" />
            </div>
          </fast-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import field from "./utils/field.js";
import { utilsMixins } from "./mixins/utilsMixins";
export default {
  mixins: [utilsMixins],
  props: {
    viewPageCode: { type: String, default: "" },
    // 创建表单组件对象【传入】
    dynamicFormFields: { type: Array, default: () => [] },
    // 创建表单组件对应字段对象【传入】
    dynamicFieldsData: { type: Object, default: () => {} },
    // 表格对象
    dynamicTableOptions: { type: Object, default: () => {} },
    // 是否是查询条件
    isSearch: { type: Boolean, default: false },
    // 动态按钮
    dynamicBtns: { type: Array, default: () => [] },
    // 按钮对象索引（多个按钮对象时）【预留】
    buttonRefIndex: { type: Number, default: () => 0 },
    // 表格ref
    tableRef: {
      type: String,
      default: function () {
        return "";
      },
    },
    // 表单ref
    formRef: {
      type: String,
      default: function () {
        return "";
      },
    },
    // 表单区域
    pageAreas: { type: Array, default: () => [""] },
    // 表单对象索引（多个表单对象时）【预留】
    formRefIndex: { type: Number, default: () => 0 },
    // 是否显示配置按钮
    isShowConfigBtn: { type: Boolean, default: false },
    // 是否显示：展开/收起
    isShowMore: { type: Boolean, default: true },
    // 是否显示操作指引按钮
    isShowOperInst: { type: Boolean, default: undefined },
    // 是否显示全屏按钮
    isShowFullScreen: { type: Boolean, default: undefined },
    // 配置完成后页面刷新方式
    refurbishMode: { type: String, default: "1" },
    // 展开/收起组件数阀值
    expandBtnCount: { type: Number, default: -1 },
    // 收起组件宽度阀值
    expandBtnSpan: { type: Number, default: -1 },
    // 操作指引按钮
    dynamicOperaInstBtn: { type: Object, default: undefined },
    // 验证提示方式（0：不提示，1：message消息提示，2：自定义（执行callbackObj.onValid））
    validNoticeType: { type: String, default: "0" },
    // 回调
    // 当前已用方法：
    /* callbackObj: {
         onValid 验证表单时触发，参数：(valid, obj)
       }
    */
    callbackObj: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 是否初始化不触发change
    unTriggerChage: { type: Boolean, default: false },
    // 自定义组件加载模式（是否在mounted中加载）
    loadComponentOnInit: { type: Boolean, default: false },
    // label文本对齐方式
    labelPosition: { type: String, default: "right" },
    // 是否手动触发组件初始化
    customComponentInit: { type: Boolean, default: false },
    // inline-message
    inlineMessage: {
      type: Boolean,
      default: function () {
        return this.$fastConfig.FastConfig.inlineMessage;
      },
    },
    // 是否启用v-bind
    useVBind: {
      type: Boolean,
      default: function () {
        return this.$fastConfig.FastConfig.useVBind;
      },
    },
    // 是否支持拖动表单项
    dragFormItem: {
      type: Boolean,
      default: function () {
        return this.$fastConfig.FastConfig.dragFormItem;
      },
    },
    // 拖动表单项对应选择器
    dragHandleSelector: {
      type: String,
      default: function () {
        return this.$fastConfig.FastConfig.dragHandleSelector;
      },
    },
  },
  data() {
    return {
      // 创建表单组件对应字段对象
      formData: this.dynamicFieldsData,
      // 表单项
      fieldsComponents: [],
      // new field 表单项数据集合
      fields: {},
      // 更多列
      fieldsMore: [],
      // 重置的默认数据
      resetData: JSON.parse(JSON.stringify(this.dynamicFieldsData)),
      // 初始化数据
      initData: JSON.parse(JSON.stringify(this.dynamicFieldsData)),
      formStatus: "add", // add:新增 edit: 修改 view: 查看
      shakeTimer: null, // 防抖定时器
      shakeTimeOut: 100, // 防抖定时器时长
      inputTimer: null,
      debounceArr: {},
      // 自定义组件IDS
      componentIds: {},
      // 已绑定自定义组件IDS
      mountedComponentIds: {},
      // 是否已初始化
      hasInit: false,
    };
  },
  created() {
    if (this.customComponentInit !== true) {
      this.$nextTick(() => {
        this.initComponent();
      });
    }
  },
  mounted() {
    if (this.customComponentInit !== true) {
      let that = this;
      if (this.loadComponentOnInit) {
        setTimeout(() => {
          that.initCustComponent();
          that = null;
        }, 200);
      }
      this.setFormStatus();
    }
    this.bindDrag();
  },
  methods: {
    // 用户手动执行
    initForm() {
      this.initComponent();
      if (this.loadComponentOnInit) {
        setTimeout(() => {
          this.initCustComponent();
        }, 200);
      }
      this.setFormStatus();
    },
    initComponent() {
      const that = this;
      const fields = this.fields;
      const noComponentField = [];
      const parent = that.getParent();
      this.dynamicFormFields.forEach(item => {
        that.fieldsComponents.push(item);
        fields[item.codeField] = new field(item);
        // 抽出没有组件对应的联动字段加入联动监听事件
        item.dataOptions?.showParams
          ?.filter(s => !fields[s.k])
          .forEach(o => {
            !noComponentField.includes(o.k) && noComponentField.push(o.k);
          });
        item.dataOptions?.disabledParams
          ?.filter(s => !fields[s.k])
          .forEach(o => {
            !noComponentField.includes(o.k) && noComponentField.push(o.k);
          });
        item.dataOptions?.ruleParams
          ?.filter(s => !fields[s.k])
          .forEach(o => {
            !noComponentField.includes(o.k) && noComponentField.push(o.k);
          });
        item.dataOptions?.triggerParams
          ?.filter(s => !fields[s.split("-")[1]])
          .forEach(o => {
            !noComponentField.includes(o.split("-")[1]) && noComponentField.push(o.split("-")[1]);
          });
      });
      for (let noIndex = noComponentField.length - 1; noIndex >= 0; noIndex--) {
        if (fields[noComponentField[noIndex]]) {
          noComponentField.splice(noIndex, 1);
        } else {
          fields[noComponentField[noIndex]] = new field({ codeField: noComponentField[noIndex] });
        }
      }
      this.fieldsComponents.forEach(item => {
        const current = fields[item.codeField];
        // 注册【自定义change】联动事件 （条件：change联动配置不等于false）
        if (current.change && current.dataOptions.triggerChange !== false) {
          // triggerQuery: 是否触发值联动，isSetEmpty：是否清空目标值，isInit：是否初始化，selectData：数据集，triggerEvn：触发事件
          current.setChangeAction(function (triggerQuery, isSetEmpty, isInit, selectData, triggerEvn) {
            if (triggerQuery === false || (that.unTriggerChage === true && isInit === true)) {
              return;
            }
            // 从change进入的触发直接返回（不执行doChildEventFunc，否则循环调用）
            if (triggerEvn === "change") {
              return;
            }
            if (that.debounceArr[current.codeField + "$change"]) {
              clearTimeout(that.debounceArr[current.codeField + "$change"]);
            }
            that.debounceArr[current.codeField + "$change"] = setTimeout(() => {
              that.doChildEventFunc(current.change, { comp: current, selectData }, triggerEvn);
            }, 50);
          });
        }
        // 注册【查询】联动事件
        const options = item.dataOptions;
        options?.triggerParams?.forEach(o => {
          // 查询字段名称-formData对象的字段
          const k = o.split("-")[1] || o.split("-")[0];
          const target = fields[k];
          // triggerQuery: 是否触发值联动，isSetEmpty：是否清空目标值，isInit：是否初始化（是否触发子联动）
          target?.setChangeAction(function (triggerQuery, isSetEmpty, isInit) {
            if (triggerQuery === false) {
              return;
            }
            if (!current.isComponent) {
              const hasOther = current.dataOptions.otherFields?.length > 0;
              current.queryOptions.call(that, current, function () {
                // 初始化则触发子联动(当弹窗时&&初始化时)
                if (hasOther) {
                  // 查询回调不清空目标值
                  that.doChangeEventByField(current.codeField, isSetEmpty, false, isInit);
                }
              });
              // 非初始化则触发子联动(当弹窗时&&初始化时)
              if (isInit !== true) {
                // 查询回调不清空目标值
                that.doChangeEventByField(current.codeField, isSetEmpty, triggerQuery, isInit);
              }
            } else {
              // 自定义组件联动事件触发（通过changeCode触发）
              if (that.$refs[current.refs] && that.$refs[current.refs][0]?.setQueryFields) {
                that.$refs[current.refs][0].setQueryFields(that.formData, "formData");
                // 自定义组件触发子联动
                if (isInit !== true) {
                  that.doChangeEventByField(current.codeField, isSetEmpty, triggerQuery, isInit);
                }
              } else {
                setTimeout(() => {
                  if (that.$refs[current.refs] && that.$refs[current.refs][0]?.setQueryFields) {
                    that.$refs[current.refs][0].setQueryFields(that.formData, "formData");
                  }
                  // 自定义组件触发子联动
                  if (isInit !== true) {
                    that.doChangeEventByField(current.codeField, isSetEmpty, triggerQuery, isInit);
                  }
                }, 10);
              }
            }
          });
        });
        // 注册【显隐】联动事件
        options?.showParams?.forEach(o => {
          const target = fields[o.k];
          target?.setChangeAction(function () {
            that.setShowAndDisable(item, options.showParams, "isShow", options.showParamsType, options.showCompareType);
          });
        });
        // 注册【是否可用】联动事件（k键 v值 rv返回值）
        options?.disabledParams?.forEach(o => {
          const target = fields[o.k];
          target?.setChangeAction(function () {
            that.setShowAndDisable(
              item,
              options.disabledParams,
              "disabled",
              options.disabledParamsType,
              options.disabledCompareType
            );
          });
        });
        // 注册【验证项(rules-必填)】联动事件
        item.rules &&
          options?.ruleParams?.forEach(o => {
            const target = fields[o.k];
            target?.setChangeAction(function () {
              that.setRuleValidator(item, options.ruleParams);
            });
          });
        // 注册【下拉内容同步到其他字段】联动事件
        item?.isComponent !== true &&
          options?.otherFields?.forEach(o => {
            current.setChangeAction(function () {
              that.setOtherFields(item, o);
            });
          });
        // 初始化下拉项
        if (
          !current.isComponent &&
          current.dataOptions &&
          (current.dataOptions.dataSource?.apiUrl || current.dataOptions.dataSource?.options) &&
          (!current.dataOptions.triggerParams || current.dataOptions.triggerParams.length === 0)
        ) {
          current.queryOptions.call(that, current, function () {
            // 触发子联动
            let triggerQuery = false;
            // 非弹窗时（弹窗会触发一次联动） && 没有包含联动的自定义组件时初始化查询（自定义组件也会触发一次，所以防止重复触发）
            if (!parent?.isDialog && !that.hasCustComponentTrigger()) {
              triggerQuery = true;
            }
            that.doChangeEventByField(current.codeField, false, triggerQuery);
          });
        }
      });
      // 触发定义组件自动联动
      !parent?.isDialog &&
        noComponentField.forEach(c => {
          that.doChangeEventByField(c, false, true, true);
        });
    },
    // 初始化自定义组件（需要在mounted中执行，且微任务nextTick执行两次后）
    initCustComponent() {
      if (this.hasCustComponentTrigger() || !this.fieldsComponents.some(o => o.isComponent)) {
        const parent = this.getParent();
        if (!parent?.isDialog) {
          this.doAllChangeAction(false, true);
        }
      }
    },
    // 是否含有对自定义组件属性的联动依赖
    hasCustComponentTrigger() {
      // 存在自定义组件 && 自定义组件联动依赖其它组件
      var result = this.fieldsComponents.some(
        o =>
          o.isComponent &&
          (o.dataOptions?.triggerParams?.length > 0 ||
            o.dataOptions?.showParams?.length > 0 ||
            o.dataOptions?.disabledParams?.length > 0 ||
            o.dataOptions?.otherFields?.length > 0 ||
            o.dataOptions?.ruleParams?.length > 0)
      );
      if (!result) {
        // 存在自定义组件 && 被其它非自定义组件联动依赖
        const custCodeFields = this.fieldsComponents.filter(o => o.isComponent).map(o => o.codeField);
        if (custCodeFields.length > 0) {
          result = this.fieldsComponents.some(
            o =>
              !o.isComponent &&
              (o.dataOptions?.triggerParams
                ?.join("-")
                .split("-")
                .some(p => custCodeFields.includes(p)) ||
                o.dataOptions?.showParams
                  ?.join("-")
                  .split("-")
                  .some(p => custCodeFields.includes(p)) ||
                o.dataOptions?.disabledParams
                  ?.join("-")
                  .split("-")
                  .some(p => custCodeFields.includes(p)) ||
                o.dataOptions?.otherFields
                  ?.join("-")
                  .split("-")
                  .some(p => custCodeFields.includes(p)) ||
                o.dataOptions?.ruleParams
                  ?.join("-")
                  .split("-")
                  .some(p => custCodeFields.includes(p)))
          );
        }
      }
      return result;
    },
    // 设置表单状态（自动从dialog同步）
    setFormStatus(dialogStatus) {
      if (!dialogStatus) {
        const parent = this.getParent();
        if (parent?.isDialog === true) {
          this.formStatus = parent?.dialogStatus;
        } else if (this.$route.params?.formStatus) {
          // 从传递参数读取
          this.formStatus = this.$route.params.formStatus;
        }
      } else {
        this.formStatus = dialogStatus;
      }
    },
    // 手动设置某个属性值
    reloadFormFields(codeField, attr, data) {
      this.fields.map((item, i) => {
        if (item.codeField === codeField) {
          item[attr] = data;
          return false;
        }
      });
      this.fieldsMore.map((item, i) => {
        if (item.codeField === codeField) {
          item[attr] = data;
          return false;
        }
      });
    },
    // 清空表单对象数据
    emptyFormData() {
      this.$refs.ruleForm.resetFields();
      for (const f in this.formData) {
        if (Object.prototype.hasOwnProperty.call(this.initData, f)) {
          this.formData[f] =
            this.initData[f] instanceof Array ? JSON.parse(JSON.stringify(this.initData[f])) : this.initData[f];
        } else {
          this.formData[f] = "";
        }

        // 使用initData对象作为清空数据
        // if (f.indexOf(',') > -1) {
        //   if (this.dynamicFormFields.some(o => o.codeField === f && o.dataOptions?.hasDefault)) {
        //     this.formData[f] = this.initData[f] || ''
        //   }
        //   this.formData[f.split(',')[0]] = this.formData[f].split(',')[0]
        //   if (this.formData[f].split(',').length > 1) {
        //     this.formData[f.split(',')[1]] = this.formData[f].split(',')[1]
        //   } else {
        //     this.formData[f.split(',')[1]] = ''
        //   }
        // } else {
        //   if (!this.dynamicFormFields.some(o => o.codeField === f) ||
        //       this.dynamicFormFields.some(o => o.codeField === f && o.dataOptions?.hasDefault)) {
        //     this.formData[f] = this.initData[f] || ''
        //   }
        // }
        // // 初始化隐藏组件值
        // if (this.dynamicFormFields.some(o => o.codeField === f && o.isMust === false)) {
        //   this.formData[f] = this.initData[f] || ''
        // }
      }
    },
    // 重置表单数据
    resetFormData(isInit) {
      this.setFormStatus();
      if ((this.formStatus || "add") === "add") {
        this.emptyFormData();
      } else {
        for (const i in this.formData) {
          if (Object.prototype.hasOwnProperty.call(this.resetData, i)) {
            this.formData[i] =
              this.resetData[i] instanceof Array ? JSON.parse(JSON.stringify(this.resetData[i])) : this.resetData[i];
          }
        }
      }
      this.initFormData(isInit);
    },
    // 重新加载表单数据（用路由页面中的表单）
    reloadFormData(isInit, isCache) {
      this.setFormStatus();
      this.resetData = JSON.parse(JSON.stringify(this.formData));
      if (!isCache) {
        this.initData = JSON.parse(JSON.stringify(this.formData));
      }
      this.initFormData(isInit);
    },
    // 初始化表单数据
    initFormData(isInit) {
      if (Object.keys(this.componentIds).length === 0) {
        // 触发联动
        this.doAllChangeAction(false, isInit);
        // formStatus（表单状态）联动
        this.doChangeEventByField("formStatus", false);
        this.$nextTick(() => {
          this.$refs.ruleForm?.clearValidate();
        });
        this.hasInit = true;
      } else {
        setTimeout(() => {
          this.initFormData(isInit);
        }, 50);
      }
    },
    // selectData: 选择数据集
    doChildEvent(clickEvent, args, triggerEvn) {
      // 检查是否符合校验
      this.inputTextOnCheck(args, triggerEvn);

      const { comp } = args;
      // 自定义组件 && change事件 && 与注册【自定义change】联动事件对应(triggerChange===true时不注册联动事件) 由setComponentData执行
      if (comp?.isComponent && comp.change && triggerEvn === "change" && comp.dataOptions.triggerChange === false) {
        return;
      }

      if (triggerEvn === "input") {
        if (this.inputTimer) {
          window.clearTimeout(this.inputTimer);
        }
        let that = this;
        that.inputTimer = setTimeout(function () {
          that.doChildEventFunc(clickEvent, args, triggerEvn);
          that = null;
        }, 500);
      } else {
        this.doChildEventFunc(clickEvent, args, triggerEvn);
      }
    },
    doChildEventFunc(clickEvent, args, triggerEvn) {
      const { comp, selectData } = args;
      this.fastEventAdapter(clickEvent, comp, selectData);
      if (triggerEvn === "change" && comp?.codeField) {
        // 执行联动
        this.doChangeEventByField(comp.codeField, null, null, null, selectData, triggerEvn);
        // 针对输入框必填联动刷新（需要强制刷新） ---- 已作废，使用this.$set代替
        // if (this.fieldsComponents.some(o => o.dataOptions && o.dataOptions.ruleParams && o.dataOptions.ruleParams.some(r => r.k === comp.codeField))) {
        //   this.$forceUpdate();
        // }
      }
    },
    // 触发【查询】联动事件，codeField：表单字段，isSetEmpty: 是否置空（默认true），triggerQuery：是否触发下拉查询，isInit：是否初始化
    //                                         selectData：选中数据数组, triggerEvn：触发事件，triggerFrom：触发来源（code:代码(默认),event:手动操作）
    doChangeEvent(codeField, isSetEmpty, triggerQuery, isInit, selectData, triggerEvn, triggerFrom) {
      const obj = this.fields[codeField];
      // 下拉框加入“全选”操作
      this.setAllOptionValue(obj, triggerFrom);
      if (obj?.changeAction && obj?.changeAction.length > 0) {
        // 清空字段值
        if (isSetEmpty !== false) {
          let that = this;
          Object.keys(this.fields)
            .filter(k =>
              this.fields[k].dataOptions?.triggerParams?.some(
                o =>
                  (!o.split("-")[1] && o.split("-")[0] === codeField) ||
                  (o.split("-")[1] && o.split("-")[1] === codeField)
              )
            )
            .forEach(field => {
              const comp = that.fieldsComponents.find(c => c.codeField === field);
              if (comp?.dataOptions?.triggerSetEmpty !== false) {
                Object.prototype.hasOwnProperty.call(that.formData, field) ? (that.formData[field] = "") : false;
                if (that.fieldsComponents.some(c => c.codeField === field && c.textField)) {
                  that.fieldsComponents
                    .filter(c => c.codeField === field && c.textField)
                    .forEach(fc => {
                      Object.prototype.hasOwnProperty.call(that.formData, fc.textField)
                        ? (that.formData[fc.textField] = "")
                        : false;
                    });
                }
              }
            });
          that = null;
        }
        if (obj.dataOptions?.dataSource?.options?.length > 0) {
          // 选择项 - 非自定义组件
          if (!selectData) {
            if (obj.isMul) {
              selectData = obj.dataOptions.dataSource.options.filter(o =>
                this.formData[obj.codeField]?.includes(
                  o[obj.newValue || "value" || obj.dataOptions.dataSource?.optionsConfig.value]
                )
              );
            } else {
              selectData = obj.dataOptions.dataSource.options.filter(
                o =>
                  o[obj.newValue || "value" || obj.dataOptions.dataSource?.optionsConfig.value] ===
                  this.formData[obj.codeField]
              );
            }
          }
          if (obj.listField) {
            this.formData[obj.listField] = selectData;
          }
        } else {
          // 选择项 - 自定义组件
          if (obj.listField) {
            this.formData[obj.listField] = selectData;
          }
        }
        // 触发联动
        for (var i in obj?.changeAction) {
          obj.changeAction[i](triggerQuery, isSetEmpty, isInit, selectData, triggerEvn);
        }
      }
      // 触发来源为手动触发(event) && change联动配置等于false，与注册【自定义change】联动事件对应(triggerChange===true时不注册联动事件)
      if (triggerFrom === "event" && obj?.change && obj.dataOptions.triggerChange === false) {
        this.fastEventAdapter(obj.change, obj, selectData);
      }
    },
    // 设置全选值
    setAllOptionValue(obj, triggerFrom) {
      if (triggerFrom === "event" && obj?.type === "dropdownList" && obj?.isMul && obj.dataOptions.needAllOption) {
        // 手动操作(event) 且 下拉框多选 且 设置了全选项时
        const defVal = obj.dataOptions.allOptionValue || "-";
        if (defVal && this.formData[obj.codeField] instanceof Array) {
          if (!this.formData[obj.codeField + "@LastOpt"]) {
            this.formData[obj.codeField + "@LastOpt"] = [];
          }
          const oldHasAll = this.formData[obj.codeField + "@LastOpt"].includes(defVal);
          const nowHasAll = this.formData[obj.codeField].includes(defVal);
          if (oldHasAll && nowHasAll) {
            // 全选，本次存在全选：去掉全选项
            this.formData[obj.codeField].splice(this.formData[obj.codeField].indexOf(defVal), 1);
          } else if (oldHasAll && !nowHasAll) {
            // 上次存在全选，本次不存在全选：全不选操作
            this.formData[obj.codeField] = [];
          } else if (!oldHasAll && nowHasAll) {
            // 上次不存在全选，本次存在全选：全选操作
            this.formData[obj.codeField] = [
              ...obj.dataOptions.dataSource.options.map(o => o["value"] || o[obj.newValue]),
            ];
          }
          this.formData[obj.codeField + "@LastOpt"] = JSON.parse(JSON.stringify(this.formData[obj.codeField]));
        }
      }
    },
    // 触发change事件
    fastEventAdapter(clickEvent, comp, selectData) {
      this.eventAdapter(
        clickEvent,
        { configObj: comp, selectData: selectData },
        function () {
          // [执行前]事件埋点
          if (window.__TRACK_) {
            window.__TRACK_.btnStart(comp.labelName + "(comp)");
          }
        },
        function () {
          // [执行后]事件埋点
          if (window.__TRACK_) {
            window.__TRACK_.btnSave();
          }
        }
      );
    },
    // 触发【查询】联动事件（by codeField），isSetEmpty: 是否置空（默认true），triggerQuery：是否触发下拉查询，isInit：是否初始，selectData：选中数据数组, triggerEvn：触发事件
    doChangeEventByField(codeField, isSetEmpty, triggerQuery, isInit, selectData, triggerEvn) {
      // 改为不需要判断字段是否有对应组件都可以出发联动事件
      // const comp = this.fieldsComponents.filter(o => o.codeField === codeField);
      // if (comp && comp.length === 1) {
      //   this.doChangeEvent(codeField, isSetEmpty);
      // }
      this.doChangeEvent(codeField, isSetEmpty, triggerQuery, isInit, selectData, triggerEvn);
    },
    // 触发【查询】联动事件（触发所有，一般用于重置后，或表单赋值后）
    doAllChangeAction(isSetEmpty, isInit) {
      for (var field in this.formData) {
        // 非初始化 || 组件不包含默认值（！hasDefault=true）
        if (
          !isInit ||
          this.hasInit ||
          !this.dynamicFormFields.some(o => o.codeField === field && o?.dataOptions?.hasDefault === true)
        ) {
          // 触发联动事件
          this.doChangeEventByField(field, isSetEmpty);
        }
      }
    },
    // 弹窗中触发的联动（dialogMixins中调用）
    doAllChangeActionOnDialog(isSetEmpty = false) {
      if (Object.keys(this.componentIds).length === 0) {
        for (var field in this.formData) {
          this.doChangeEventByField(field, isSetEmpty);
        }
        this.doChangeEventByField("formStatus", isSetEmpty, true, true);
      } else {
        setTimeout(() => {
          this.doAllChangeActionOnDialog();
        }, 50);
      }
    },
    // 触发【显隐、可读】联动事件（traggerType，触发类型：0/默认:不满足即返回，1:所有项都满足（and），2:只需要满足一项（or））
    // compareType，值未数组时比对方式(数组时生效): 0/默认:只需一个包含在条件中，1：值数组都包含在条件中
    setShowAndDisable(target, params, type, traggerType, compareType) {
      let that = this;
      if (that.debounceArr[target.compKey + target.codeField + "$" + type]) {
        clearTimeout(that.debounceArr[target.compKey + target.codeField + "$" + type]);
      }
      that.debounceArr[target.compKey + target.codeField + "$" + type] = setTimeout(() => {
        const flag = that.getTraggerFlag(params, traggerType, compareType);
        if (target[type] === undefined) {
          that.$set(target, type, flag);
        } else {
          target[type] = flag;
        }
        that = null;
      }, 50);
    },
    // 触发【设置其他字段】联动事件
    setOtherFields(target, params) {
      const valueName = target.newValue || "value";
      const queryParamName = params.split("-")[0];
      if (queryParamName) {
        const formFieldName = params.split("-")[1] || params.split("-")[0];
        let options = [];
        const isArray = this.formData[target.codeField] instanceof Array;
        if (target.dataOptions.dataSource && target.dataOptions.dataSource.options) {
          if (isArray) {
            options = target.dataOptions.dataSource.options.filter(o =>
              this.formData[target.codeField].includes(o[valueName])
            );
          } else {
            options = target.dataOptions.dataSource.options.filter(
              o => o[valueName] === this.formData[target.codeField]
            );
          }
        }
        if (options && options.length > 0 && options.some(o => o[queryParamName] || o[queryParamName] === 0)) {
          if (isArray) {
            this.formData[formFieldName] = options.map(opt =>
              opt[queryParamName] !== null ? opt[queryParamName] : ""
            );
          } else {
            this.formData[formFieldName] = options[0][queryParamName] !== null ? options[0][queryParamName] : "";
          }
        } else {
          // codeField为空时才赋空值
          if (isArray) {
            if (
              !this.formData[target.codeField] ||
              !this.formData[target.codeField] instanceof Array ||
              this.formData[target.codeField].length === 0
            ) {
              this.formData[formFieldName] = [];
            }
          } else {
            if (!this.formData[target.codeField]) {
              this.formData[formFieldName] = "";
            }
          }
        }
        if (target.dataOptions?.isTraggerOtherFields !== false) {
          this.doChangeEventByField(formFieldName, false);
        }
      }
    },
    // 触发【验证项(rules-必填)】联动事件
    setRuleValidator(target, params) {
      if (params.some(o => o.ruleType)) {
        let typeArr = params.map(param => {
          return param.ruleType;
        });
        typeArr = Array.from(new Set(typeArr));
        typeArr.forEach(type => {
          const ruleTypes = target.rules.filter(o => o.ruleType === type);
          const flag = this.getTraggerFlag(params.filter(o => o.ruleType === type));
          ruleTypes.forEach(rt => {
            rt.enable === undefined ? this.$set(rt, "enable", flag) : (rt.enable = flag);
          });
        });
      } else {
        const flag = this.getTraggerFlag(params);
        target.rules.forEach(rt => {
          rt.enable === undefined ? this.$set(rt, "enable", flag) : (rt.enable = flag);
          rt.message = rt.message + " ";
        });
        this.$refs.ruleForm.clearValidate(target.codeField);
      }
    },
    // 获取条件是否满足（traggerType，触发类型：0/默认:不满足即返回，1:所有项都满足（and），2:只需要满足一项（or））
    // compareType，值未数组时比对方式(数组时生效): 0/默认:只需一个包含在条件中，1：值数组都包含在条件中
    getTraggerFlag(params, traggerType = "0", compareType = "0") {
      let flag = true;
      let firstFlag = null;
      for (let i = 0; i < params.length; i++) {
        if (params[i].rv === undefined || params[i].rv === null) {
          params[i].rv = true;
        }
        if (firstFlag === null) {
          firstFlag = params[i].rv;
        }
        if (params[i].k !== "formStatus") {
          params[i].v === undefined || params[i].v === null ? (params[i].v = "") : false;
          if (params[i].v === "") {
            flag = this.formData[params[i].k] === "" ? params[i].rv : !params[i].rv;
          } else {
            const arrV = params[i].v.split(",");
            const formV = this.formData[params[i].k] + "";
            let isInclude = false;
            if (formV.indexOf(",") > -1) {
              if (compareType === "0") {
                // 只需存在一个包含
                isInclude = formV.split(",").some(v => arrV.includes(v));
              } else if (compareType === "1") {
                // 全包含
                isInclude = formV.split(",").every(v => arrV.includes(v));
              } else {
                isInclude = arrV.includes(formV);
              }
            } else {
              isInclude = arrV.includes(formV);
            }
            flag = isInclude ? params[i].rv : !params[i].rv;
          }
        } else {
          flag = this.formStatus === params[i].v ? params[i].rv : !params[i].rv;
        }
        if (traggerType === "2") {
          if (firstFlag === flag) {
            break;
          }
        } else {
          if (firstFlag !== flag) {
            break;
          }
        }
      }
      return flag;
    },
    // 手动刷新下拉框(dropdownList)下拉项
    doRefreshByField(codeField, cb) {
      const obj = this.fields[codeField];
      obj?.queryOptions?.call(this, obj, cb);
    },
    showLabel(item) {
      // 判断超过4个字的显示溢出效果
      if (item.labelName.length > (item.maxWordCount || this.$fastConfig.FastConfig.labelMaxWordCount)) {
        if (item.showLabel !== undefined) {
          item.showLabel = true;
        } else {
          this.$set(item, "showLabel", true);
        }
      }
    },
    hideLabel(item) {
      item.showLabel = false;
    },
    // 触发【赋值】联动事件【自定义组件】
    getComponentData() {
      if (typeof arguments[0] === "object" && arguments[0]?.val) {
        // 使用新版组件逻辑
        const { val, txt, codeField, comType, popupsKey, textField, otherField, selectData, options } = arguments[0];
        this.setComponentData(val, txt, codeField, comType, popupsKey, textField, otherField, selectData, options);
      } else {
        // 使用旧版组件逻辑
        this.setComponentData(
          arguments[0],
          arguments[1],
          arguments[2],
          arguments[3],
          arguments[4],
          arguments[5],
          arguments[6],
          arguments[7],
          arguments[8]
        );
      }
    },
    // 触发【赋值】联动事件【自定义组件】 - 处理逻辑
    // val:值, codeField:绑定formData的字段名称, comType:组件类型（表格中有效），popupsKey：【已作废】
    // textField：文本字段，otherField：赋值其他字段(预留)，selectData：返回数据对象(预留)
    // options: 其他可变选项
    setComponentData(val, txt, codeField, comType, popupsKey, textField, otherField, selectData, options = {}) {
      // 赋值
      let isMulField = false;
      let defValue = this.formData[codeField];
      if (
        codeField &&
        codeField.indexOf(",") > -1 &&
        (val === "" || (val.indexOf(",") > -1 && codeField.split(",").length === val.split(",").length))
      ) {
        // 双日期处理
        const arrCoodField = codeField.split(",");
        const arrVal = val.split(",");
        for (let i = 0; i < arrCoodField.length; i++) {
          // 双日期不许判断是否存在
          if (typeof this.formData[arrCoodField[i]] === "number") {
            this.formData[arrCoodField[i]] = val === "" ? 0 : parseInt(arrVal[i]);
          } else {
            this.formData[arrCoodField[i]] = val === "" ? "" : arrVal[i];
          }
        }
        isMulField = true;
      }
      if (codeField in this.formData) {
        if (typeof this.formData[codeField] === "number") {
          if (val.indexOf(".") > -1) {
            this.formData[codeField] = parseFloat(val);
          } else {
            this.formData[codeField] = parseInt(val);
          }
        } else {
          this.formData[codeField] = isMulField && val === "," ? "" : val;
        }
      }
      if (textField in this.formData) {
        this.formData[textField] = txt;
      }

      // 列表数据
      const lstComps = this.fieldsComponents.filter(o => o.codeField === codeField && o.listField);
      lstComps.length > 0 &&
        selectData?.length > 0 &&
        lstComps.forEach(comp => {
          this.formData[comp.listField] = selectData;
        });

      // 更新初始化数据
      if (options?.updateInitData) {
        this.initData[codeField] = this.formData[codeField];
        if (textField && textField in this.formData) {
          this.initData[textField] = this.formData[textField];
        }
        const parent = this.getParent();
        if (parent?.dialogStatus === "comp" && parent.compOps?.triggerValueObject) {
          // 作为组件时需要赋值到联动对象中（解决二次打开被重置问题）
          if (codeField && Object.prototype.hasOwnProperty.call(parent.compOps.triggerValueObject, codeField)) {
            parent.compOps.triggerValueObject[codeField] = this.initData[codeField];
          }
          if (textField && Object.prototype.hasOwnProperty.call(parent.compOps.triggerValueObject, textField)) {
            parent.compOps.triggerValueObject[textField] = this.initData[textField];
          }
        }
      }

      // 赋值其它字段
      const comp = this.fieldsComponents.find(o => o.codeField === codeField);
      if (!otherField || typeof otherField !== "string") {
        if (comp && comp.dataOptions.otherFields?.length > 0) {
          this.setOtherField(comp.dataOptions.otherFields.join(","), selectData, comp, options);
        }
      } else {
        this.setOtherField(otherField, selectData, comp, options);
      }

      // 跨表单赋值
      this.setCrossFormFields(comp);

      if (this.debounceArr[codeField + "$changeCode"]) {
        clearTimeout(this.debounceArr[codeField + "$changeCode"]);
      }
      this.debounceArr[codeField + "$changeCode"] = setTimeout(() => {
        let isSetEmpty = null;
        // 当前值变动由“空”改变 && 初始化数据 => 不清空数据（解决默认值赋值问题）
        if (!defValue && options?.updateInitData) {
          isSetEmpty = false;
        }
        this.doChangeEventByField(codeField, isSetEmpty, null, false, selectData);
        defValue = null;
      }, 100);

      // change联动配置等于false，与注册【自定义change】联动事件对应(triggerChange===true时不注册联动事件)
      if (comp?.change && comp.dataOptions.triggerChange === false) {
        this.fastEventAdapter(comp.change, comp, selectData);
      }
    },
    // 其它选中对象（自定义组件）返回值
    setOtherField(otherField, selectData, comp, options) {
      if (otherField && otherField !== "") {
        var arrOtherField = otherField.split(",");
        for (var i = 0; i < arrOtherField.length; i++) {
          var arrOtherFieldVal = arrOtherField[i].split("-");
          if (arrOtherFieldVal.length === 1) arrOtherFieldVal.push(arrOtherFieldVal[0]);
          var strOtherCode = "";
          if (selectData?.constructor === Array) {
            for (var j = 0; j < selectData.length; j++) {
              if (selectData[j] && Object.prototype.hasOwnProperty.call(selectData[j], arrOtherFieldVal[0])) {
                // 读取组件中字段值
                strOtherCode +=
                  (selectData[j][arrOtherFieldVal[0]] !== null ? selectData[j][arrOtherFieldVal[0]] : "") + ",";
              }
            }
          } else if (selectData?.constructor === Object) {
            if (Object.prototype.hasOwnProperty.call(selectData, arrOtherFieldVal[0])) {
              if (selectData[arrOtherFieldVal[0]] instanceof Array) {
                strOtherCode = selectData[arrOtherFieldVal[0]].join(",");
              } else {
                strOtherCode = selectData[arrOtherFieldVal[0]] !== null ? selectData[arrOtherFieldVal[0]] : "";
              }
            }
          }
          if (strOtherCode !== "" && strOtherCode.endsWith(",")) {
            strOtherCode = strOtherCode.substring(0, strOtherCode.length - 1);
          }
          if (Object.prototype.hasOwnProperty.call(this.formData, arrOtherFieldVal[1])) {
            this.formData[arrOtherFieldVal[1]] = strOtherCode;
          } else {
            this.$set(this.formData, arrOtherFieldVal[1], strOtherCode);
          }
          // 更新初始化数据
          if (options?.updateInitData) {
            this.initData[arrOtherFieldVal[1]] = this.formData[arrOtherFieldVal[1]];
          }
          // 触发联动
          if (comp?.dataOptions?.isTraggerOtherFields !== false) {
            this.doChangeEventByField(arrOtherFieldVal[1], false);
          }
        }
      }
    },
    // 跨表单赋值
    setCrossFormFields(comp) {
      if (comp?.formRef && comp.formRef !== this.formRef && comp.dataOptions?.crossFormFields?.length > 0) {
        const parent = this.getParent();
        if (parent?.$refs && this.$fastUtils.getDomByRef(parent, comp.formRef)) {
          const relateForm = this.$fastUtils.getDomByRef(parent, comp.formRef);
          comp.dataOptions.crossFormFields.forEach(f => {
            if (this.formData[f.split("-")[0]] !== undefined) {
              relateForm.formData[f.split("-")[1]] = this.formData[f.split("-")[0]];
              relateForm.doChangeEventByField(f.split("-")[1], false);
            }
          });
        }
      }
    },
    // 验证表单
    validateForm(cb) {
      let that = this;
      this.$refs.ruleForm?.validate((valid, obj) => {
        cb.call(this, valid, obj);
        if (!valid) {
          that.custVoild(valid, obj);
        }
        that = null;
      });
    },
    // 保存表单
    saveFastForm(options) {
      let that = this;
      // 验证表单
      that.$refs.ruleForm?.validate((valid, obj) => {
        if (valid) {
          if (window.__TRACK_) {
            // 通过埋点控制按钮可用状态实现防抖
            that.saveFormVoilded(options);
            that = null;
          } else {
            // 通过防抖定时器实现防抖
            if (that.shakeTimer) {
              window.clearTimeout(that.shakeTimer);
            }
            that.shakeTimer = window.setTimeout(function () {
              that.saveFormVoilded(options);
              that = null;
            }, that.shakeTimeOut);
          }
        } else {
          that.custVoild(valid, obj);
          that = null;
        }
      });
    },
    // 自定义验证表单提示
    custVoild(valid, obj) {
      let that = this;
      if (that.validNoticeType === "1") {
        var arrErrInfo = [];
        for (let f = 0; f < that.fieldsComponents.length; f++) {
          if (obj[that.fieldsComponents[f].codeField] !== undefined) {
            arrErrInfo.push(obj[that.fieldsComponents[f].codeField][0].message);
            break;
          }
        }
        if (arrErrInfo.length > 0) {
          that.$message({ message: arrErrInfo[0], type: "warning" });
        }
      } else if (that.validNoticeType === "2") {
        that.execCallBack("onValid", valid, obj);
      }
      that = null;
    },
    saveFormVoilded(options) {
      // apiParams: api请求参数，formData: api请求参数/表单对象，editFormData：上级组件中表格选中的行数据
      const { apiParams, formData, apiParamName, apiStyle, apiConfig, editFormData, callback } = options;
      const requestData = JSON.parse(JSON.stringify(apiParams || formData || this.formData));
      if (apiParams || formData) {
        let formFieldData = null;
        if (apiParams) {
          // 有传入apiParams参数时优先使用formData
          formFieldData = formData || this.formData;
        } else {
          // 没传入apiParams时使用this.formData
          formFieldData = this.formData;
        }
        for (const f in requestData) {
          if (Object.prototype.hasOwnProperty.call(formFieldData, f)) {
            requestData[f] = formFieldData[f];
          } else if (editFormData && Object.prototype.hasOwnProperty.call(editFormData, f)) {
            requestData[f] = editFormData[f];
          }
        }
      }
      // 去除空格
      if (this.$fastConfig.FastConfig.trimSaveString) {
        for (const key in requestData) {
          if (requestData[key] && typeof requestData[key] === "string") {
            requestData[key] = requestData[key].trim();
          }
        }
      }

      // 适配层级参数
      let dataInfo = {};
      if (apiParamName) {
        dataInfo[apiParamName] = requestData;
      } else {
        dataInfo = requestData;
      }
      const queryObj = {
        // 保存mutation（graphql时）
        type: "mutation",
        // api配置
        apiConfig: apiConfig,
        // 条件/实体参数（变量），根据typeParam中的定义配置
        variables:
          apiStyle === "graphql"
            ? {
                // 当前中台使用的名称有dataInfo、info，具体查看API文档
                dataInfo: dataInfo,
              }
            : dataInfo,
      };
      // 转换了中台请求格式数据
      var paramD = this.$fastGetParams(queryObj, null, apiStyle);
      // 调用中台API方法（可复用）
      this.$fastRequestAPI(paramD, apiStyle)
        .then(response => {
          // 返回json
          let resObj = null;
          if (apiStyle === "graphql") {
            resObj = response.data[queryObj.apiConfig.ServiceCode];
          } else {
            resObj = response;
          }
          if (typeof callback === "function") {
            callback.call(this, resObj);
          }
        })
        .catch(err => {
          console.info(err);
          if (typeof callback === "function") {
            callback.call(this, null);
          }
        });
    },
    // 检查输入框值
    inputTextOnCheck(args, triggerEvn) {
      if (["input", "paste"].includes(triggerEvn)) {
        // 检查是否符合校验
        const item = args.comp;
        if (item.isInput) {
          let value = this.formData[item.codeField];
          if (triggerEvn === "paste" && args.e?.clipboardData) {
            value = this.getPasteText(item, args, value);
          }
          if (item.inputRules) {
            let rules = item.inputRules;
            if (typeof rules === "string") {
              if (rules.startsWith("/")) {
                rules = rules.substring(1);
              }
              if (rules.endsWith("/")) {
                rules = rules.substring(0, rules.length - 1);
              }
              rules = new RegExp(rules, "g");
            }
            value = value.replace(rules, "");
          }
          if (item.max) {
            if (typeof item.max === "string") {
              item.max = parseInt(item.max);
            }
            if (parseInt(value) > item.max) {
              value = item.max;
            }
          }
          this.formData[item.codeField] = value;
        } else {
          if (triggerEvn === "paste" && (args.e?.clipboardData || window.clipboardData)) {
            let pasteText = this.getPasteText(item, args, this.formData[item.codeField]);
            if (item.maxlength > 0 && pasteText.length > item.maxlength) {
              pasteText = pasteText.substring(0, item.maxlength);
            }
            this.formData[item.codeField] = pasteText;
          }
        }
      }
    },
    // 获取粘贴文本
    getPasteText(item, args, oldValue) {
      const clipboardData = args.e?.clipboardData || window.clipboardData;
      if (!clipboardData) {
        return oldValue;
      }
      let pasteTxt = args.e?.clipboardData
        ? clipboardData.getData("text/plan") || clipboardData.getData("Text")
        : clipboardData.getData("Text");
      if (item.dataOptions?.changePaste) {
        switch (item.dataOptions.changePasteType) {
          default:
            // 换行符转“,”
            const pasteSplitChar = item.pasteSplitChar || ",";
            pasteTxt = pasteTxt.replace(/\s*\n\s*/g, pasteSplitChar);
            const parseArr = pasteTxt.split(pasteSplitChar);
            for (let i = 0; i < parseArr.length; i++) {
              parseArr[i] = parseArr[i].trim();
            }
            pasteTxt = parseArr.join(pasteSplitChar);
            pasteTxt.endsWith(",") ? (pasteTxt = pasteTxt.substring(0, pasteTxt.length - 1)) : false;
            break;
        }
      } else {
        // 换行符转“ ”
        pasteTxt = pasteTxt.replace(/\s*\n\s*/g, " ");
        pasteTxt.endsWith(" ") ? (pasteTxt = pasteTxt.substring(0, pasteTxt.length - 1)) : false;
      }
      if (pasteTxt && this.$fastConfig.FastConfig.trimPasteString) {
        pasteTxt = pasteTxt.trim(" ");
      }
      if (oldValue && args.e.target) {
        const selectIndex = args.e.target.selectionStart + pasteTxt.length;
        const startStr = oldValue.substring(0, args.e.target.selectionStart);
        const endStr = oldValue.substring(args.e.target.selectionEnd, oldValue.length);
        pasteTxt = startStr + pasteTxt + endStr;
        setTimeout(() => {
          args.e.target.setSelectionRange(selectIndex, selectIndex);
        });
      }
      return pasteTxt;
    },
    // 处理字符型的正则表达式
    handleRules(rules) {
      const retRules = [];
      if (rules instanceof Array) {
        rules.forEach(rule => {
          if (rule.enable !== false) {
            if (typeof rule.pattern === "string") {
              const tmpRule = JSON.parse(JSON.stringify(rule));
              try {
                // if (eval(tmpRule.pattern) instanceof RegExp) {
                //   tmpRule.pattern = eval(tmpRule.pattern);
                // }
                if (tmpRule.pattern.startsWith("/")) {
                  tmpRule.pattern = tmpRule.pattern.substring(1);
                }
                if (tmpRule.pattern.endsWith("/")) {
                  tmpRule.pattern = tmpRule.pattern.substring(0, tmpRule.pattern.length - 1);
                }
                tmpRule.pattern = new RegExp(tmpRule.pattern);
              } catch (e) {
                console.info(e);
              }
              retRules.push(tmpRule);
            } else {
              retRules.push(rule);
            }
          }
        });
      }
      return retRules;
    },
    // 触发表单验证时
    handleValidateForm(codeField, isSucc, message) {
      if (isSucc && this.formData[codeField] === "") {
        const filed = this.dynamicFormFields.find(o => o.codeField === codeField);
        if (
          filed?.dataOptions?.showValidIconOnEmpty !== true &&
          (this.$fastConfig.FastConfig.showValidIconOnEmpty === false ||
            filed?.dataOptions?.showValidIconOnEmpty === false)
        ) {
          // 不显示校验成功图标
          this.$refs.ruleForm.clearValidate(codeField);
        }
      }
    },
    // 自定义组件是否使用el-form-item的label
    useElFormItemLabel(item) {
      if (
        item.existsLabel === true ||
        (item.existsLabel === undefined && this.$fastConfig.FastConfig.existsLabel === true)
      ) {
        return true;
      }
      return false;
    },
    // 处理自定义组件labelWidth
    handleCompLabelWidth(item) {
      if (!this.useElFormItemLabel(item)) {
        return "0px";
      }
      return typeof item.labelWidth === "string" ? item.labelWidth : item.labelWidth + "px";
    },
    // 获取上级对象
    getParent() {
      var parent = this.$parent;
      while (!this.$fastUtils.getDomByRef(parent, this.formRef)) {
        parent = parent.$parent;
        if (!parent || parent.$refs?.refRouterView) {
          break;
        }
      }
      return parent;
    },
    // 执行回调事件
    execCallBack() {
      if (arguments && arguments.length > 0) {
        const funcName = arguments[0];
        if (typeof this.callbackObj[funcName] === "function") {
          const args = [];
          if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
              args.push(arguments[i]);
            }
          }
          return this.callbackObj[funcName](...args);
        }
      }
      return "null";
    },
    // 获取是否FD中引入
    getIsFastDesigner(obj) {
      if (!this.loadComponentOnInit) {
        const compKey = obj.compKey + "_" + obj.codeField;
        if (!Object.prototype.hasOwnProperty.call(this.mountedComponentIds, compKey)) {
          this.componentIds[compKey] = "";
        }
      }
      return true;
    },
    // 自定义组件加载回调
    componentHookChange(hookType, obj) {
      if (this.loadComponentOnInit) {
        return;
      }
      if (hookType === "mounted") {
        const compKey = obj.compKey + "_" + obj.codeField;
        this.mountedComponentIds[compKey] = "";
        if (Object.prototype.hasOwnProperty.call(this.componentIds, compKey)) {
          delete this.componentIds[compKey];
        }
        if (Object.keys(this.componentIds).length === 0) {
          setTimeout(() => {
            this.initCustComponent();
          }, 10);
          const parent = this.getParent();
          this.tableRef && parent.setTableHeight && parent.setTableHeight(this.tableRef);
        }
      }
    },
    // 组件鼠标经过事件
    compOnMouseOver(comp) {
      if (!comp.isMul || !comp.disabled) return;
      const el = this.$el.querySelector("#" + comp.type + "-" + comp.compKey);
      if (!el) return;
      const optionDom = el.querySelector(".fd-select-options");
      if (optionDom) return;
      if (
        !this.formData[comp.codeField] ||
        this.formData[comp.codeField].length === 0 ||
        !this.formData[comp.codeField] instanceof Array
      ) {
        return;
      }
      const div = document.createElement("div");
      div.className = "fd-select-options";
      div.onmousemove = () => this.compOnMouseOver(comp);
      div.onmouseleave = () => this.compOnMouseLeave(comp);
      let html = `<ul>`;
      this.formData[comp.codeField]?.forEach(item => {
        const option = comp.dataOptions.dataSource.options.find(o => o.value == item);
        html += "<li>" + (option?.label || item) + "</li>";
      });
      html += `</ul>`;
      div.innerHTML = html;
      el.appendChild(div);
    },
    // 组件鼠标离开事件
    compOnMouseLeave(comp) {
      if (!comp.isMul || !comp.disabled) return;
      const el = this.$el.querySelector("#" + comp.type + "-" + comp.compKey);
      if (!el) return;
      const optionDom = el.querySelector(".fd-select-options");
      if (!optionDom) return;
      el.removeChild(optionDom);
    },

    // 绑定拖拽
    bindDrag() {
      if (!this.dragFormItem) {
        return;
      }
      const that = this;
      setTimeout(() => {
        const formDom = that.$refs.ruleForm ? that.$refs.ruleForm.$el.querySelector(".fd-form-items") : null;
        if (formDom) {
          that.$Sortable?.create(formDom, {
            onEnd({ newIndex, oldIndex }) {
              const currRow1 = that.fieldsComponents.splice(oldIndex, 1)[0];
              const currRow2 = that.dynamicFormFields.splice(oldIndex, 1)[0];
              that.fieldsComponents.splice(newIndex, 0, currRow1);
              that.dynamicFormFields.splice(newIndex, 0, currRow2);
              that.$fastConfig.FastConfig.saveComps(that, null, that.dynamicFormFields);
            },
            handle: that.dragHandleSelector || ".el-form-item__label",
            chosenClass: "fd-form-sortable-chosen",
          });
        }
      }, 200);
    },
  },
};
</script>
<style lang="scss" scoped>
.btnSuffix /deep/.el-input__suffix {
  height: 93%;
  margin: 1px 1px 1px 0;
  border-left: 1px solid #dcdfe6;
  border-top: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  right: 0;
  background-color: #f5f7fa;
}

.btnSuffix .el-input__suffix {
  height: 93%;
  margin: 1px 1px 1px 0;
  border-left: 1px solid #dcdfe6;
  right: 0;
  background-color: #f5f7fa;
}

.mix-icon {
  padding: 0 10px;
  cursor: pointer;
}

.el-input-autocomplete {
  display: block;
}

.heightFix {
  height: 30px;
}

.el-form-item /deep/label + .el-form-item__content {
  margin-left: 90px;
}

.fastRuleForm .el-col .el-input,
.fastRuleForm .el-col .el-select,
.fastRuleForm .el-col .el-textarea,
.fastRuleForm .el-date-editor--daterange.el-input,
.fastRuleForm .el-date-editor--daterange.el-input__inner,
.fastRuleForm .el-date-editor--timerange.el-input,
.fastRuleForm .el-date-editor--timerange.el-input__inner {
  width: calc(100% - 5px);
}

.fastRuleForm .el-col /deep/.el-input.text-align-right input {
  text-align: right;
}

.fastRuleForm .el-col /deep/.el-input.text-align-center input {
  text-align: center;
}

.el-input-autocomplete /deep/.el-input {
  width: calc(100% - 5px);
}

.u-checkbox /deep/.el-form-item__content {
  margin-left: 0;
}

.font-Weight-red /deep/ .el-input__inner {
  font-weight: bold;
  color: red;
  font-family: "微软雅黑";
}

/deep/.fast-switch .el-form-item__content {
  text-align: left;
}

/deep/ .fd-radioGroup label.el-radio,
/deep/ .fd-radio label.el-radio {
  width: auto !important;
}

/deep/ .fd-radioGroup.is-required .el-form-item__content label:before {
  display: none;
}

/deep/ .fd-link,
.fd-label {
  text-align: left;
  padding-left: 5px;
}

.fastform-slot-rl {
  float: left;
}

.fastform-slot-rr {
  float: right;
}
.el-radio-group {
  display: flex;
}
.el-radio-group label {
  width: auto;
  height: 28px;
  line-height: 28px;
  padding: 0;
}
.el-radio-button--small /deep/.el-radio-button__inner {
  padding: 6px 15px;
}

.fd-inputInterval {
  /deep/.el-form-item__content {
    display: flex;
  }
  .fd-jg-line {
    display: inline-block;
    margin: 0 3px 0 3px;
  }
}
</style>

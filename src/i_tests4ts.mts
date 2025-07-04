/**
 * This file contains the tests4ts interfaces.
 *
 *
 * Copyright 2025 Adligo Inc / Scott Morgan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { I_Classifiable, I_Equatable } from '@ts.adligo.org/i_obj/dist/i_obj.mjs';
import { I_Named, I_String } from '@ts.adligo.org/i_strings/dist/i_strings.mjs';
import { ComparisionNodeType, ComparisonNodeInfoType, TrialType, TypeName } from '@ts.adligo.org/i_tests4ts_types/dist/i_tests4ts_types.mjs'

/**
 * This is the basic assertion
 */
export interface I_AssertionContext {
  /**
   * 
   */
  error(expected: string, runnable: () => void): void;

  equals(expected: I_EquatableString | I_Equatable | I_String | string | any, actual: I_String | string | any, message?: string): void;

  getCount(): number;

  isFalse(check: boolean, message?: string): void;

  isTrue(check: boolean, message?: string): void;

  notEquals(expected: I_EquatableString | I_Equatable | I_String | string | any, actual: I_String | string | any, message?: string): void;

  /**
   * This is the same for notUndefiend 
   */
  notNull(expected: I_String | string | any, message?: string): void;

  notSame(expected: I_String | string | any, actual: I_String | string | any, message?: string): void;

  same(expected: I_String | string | any, actual: I_String | string | any, message?: string): void;

  /**
   *
   * @param expected the expected error and it's causes to match up against,
   *   matching .name, .message, and the susequent .cause's .names and .messages.
   * @param runner
   * @param message
   */
  thrown(expected: Error, runner: I_Runnable, message?: string): void;
}

export interface I_AssertionContextFactory {
  newAssertionContext(): I_AssertionContext;
}

/**
 * To see how-to / usage go to https://github.com/adligo/tests4j.ts.adligo.org
 */
export type I_AssertionContextConsumer = (ac: I_AssertionContext) => void;

export interface I_AssertionContextResult extends I_Classifiable {
  getCount(): number;
}

export interface I_ComparisionNode extends I_ComparisionBaseEquals {
  getAssertionCount(): number;
  hasChildInfo(): boolean;
  /** 
   * The child info is basically the failue stack
   * so you can trace back through which collection failed
   * with which key or index
   */
  getChildInfo(idx: number): I_ComparisionBaseInfo;
  getChildInfoSize(): number;
}

export interface I_ComparisionBaseInfo {
  getInfoType(): ComparisonNodeInfoType;
}

export interface I_ComparisionBaseEquals {
  getActual(): any;
  getExpected(): any;
}

export interface I_ComparisionArrayInfo extends I_ComparisionBaseInfo {
  getIndex(): number;
}

export interface I_ComparisionCollectionSizeInfo extends I_ComparisionBaseInfo {
  getActualSize(): number;
  getExpectedSize(): number;
}

export interface I_ComparisionEqualInfo extends I_ComparisionBaseEquals, I_ComparisionBaseInfo {

}

export interface I_ComparisionMapValueInfo extends I_ComparisionBaseInfo {
  getKey(): any;
  getActualValue(): any;
  getExpectedValue(): any;
}

/**
 * Note this is for Sets as well as Map keys
 */
export interface I_ComparisionSetInfo extends I_ComparisionBaseInfo {
  getMissingActuals(): Set<any>;
  getMissingExpected(): Set<any>;
  isMapKeys(): boolean;
}

/**
 * Note this is for Array.isArray Maps.isMap etc
 * the type should be a class or type name i.e. boolean, Array, string, Map, Set, Object, number
 */
export interface I_ComparisionTypeInfo extends I_ComparisionBaseInfo {
  getActualType(): TypeName;
  getExpectedType(): TypeName;
}

export interface I_RecursiveEqualsResult {

  getAssertionCount(): number;

  getComparisionNode(): I_ComparisionNode;
  /**
   * if this is true then they were equals
   * if this is false they were notEquals
   */
  isSuccess(): boolean;
}

export interface I_RecursiveEqualsResultErrorFormmater {
  format(result: I_RecursiveEqualsResult, message?: string): string;
  toString(obj: I_String | string | any): string;
}

/**
 * represts something that has a equals method and a toString method
 * if these are misssing == and != are used for equality
 * and '' + yourObj are used for toString logic
 */
export interface I_EquatableString extends I_Equatable, I_String { }

/** 
 * @deprecated use I_FunctionFactory
 */
export interface I_Eval {
  eval(javaScript: string);
}

export interface I_FunctionFactory {
  newFun(...params: string[]): Function;
}
/**
 * Converts a Trial's Results into a string that can be that can be written as a file
 */
export interface I_FileConverter {
  convert(trial: I_Trial): string;

  /**
   * the extension of the file name i.e. 'xml'
   */
  getFileNameExtension(): string;
}

export type I_Runnable = () => void;

export interface I_Test extends I_Named {
  ignore(): I_Test;

  isIgnored(): any;

  run(assertionCtx: I_AssertionContext): void;
}

export interface I_TestFactory {
  getTests(params: I_TestFactoryParams, trial: I_Trial): I_Test[];
}

export interface I_TestFactoryParams {
  /**
   * defaults to an array with the Trial instance in it,
   * however this can be split up to multiple classes / files
   * like the AssertionsTrial has.
   */
  getInstancesWithTestMethods(): any[];
  /**
   * defaults to 'test'
   */
  getTestNamePrefix(): string;

  /**
   * defaults to 'Ignored'
   */
  getTestIgnoredSuffix(): string;
}

export interface I_TestParams {
  /**
   * the test name
   */
  getName();

  /** 
   * This is now the preferred way to run the test
   * and the lambda in the TestConstructor will be @depricated and eventually removed
   */
  getTestRunner(): I_TestRunner;

  /**
   * if the test is ignored
   */
  isIgnored();
}

export interface I_TestResult {
  /**
   * this will likely read c8 code coverage from json files
   * after the TrialSuite is completed running.
   */
  collectCoverage(): void;

  isPass(): boolean;

  getAssertionCount(): number;

  getErrorMessage(): string;

  getName(): string;
}

/** 
 * This will basically wrap the eval so I can 
 * move back to instance methods like other test runners
 */
export interface I_TestRunner {

  run(assertionCtx: I_AssertionContext): void;
}

export interface I_TestResultFactory {
  newTestResult(assertionCount: number, test: I_Test): I_TestResult;
  newTestResultFailure(assertionCount: number, test: I_Test, errorMessage: string): I_TestResult;
}

export interface I_TestParamsFactory {
  getTestParams(testName: string): I_TestParams;
}

export interface I_Trial extends I_Named {
  /**
   * this discovers the tests, as the Trial instance needs to be
   * created before we call Object.getKeys on it to discover the test and testIgnored
   * methods.
   */
  createTests(): I_Trial;

  getAssertionCount(): number;

  getFailureCount(): number;

  getIgnored(): any;

  getTestCount(): number;

  getTest(testName: string): I_Test;

  getTestResults(): I_TestResult[];

  getType(): TrialType;

  run(assertionCtxFactory: I_AssertionContextFactory, testResultFactory: I_TestResultFactory): I_Runnable;
}

export interface I_TrialParams extends I_Named {
  getTrialName(): string;
  getTestFactory(): I_TestFactory;
  getTestFactoryParams(): I_TestFactoryParams;
}


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

/**
 * represts something that has a equals method and a toString method
 * if these are misssing == and != are used for equality
 * and '' + yourObj are used for toString logic
 */
export interface I_EquatableString extends I_Equatable, I_String {}

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
  
  notSame(expected: I_String | string | any,  actual: I_String | string | any, message?: string): void;

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

export interface I_TestResultFactory {
  newTestResult(assertionCount: number, test: I_Test): I_TestResult;
  newTestResultFailure(assertionCount: number, test: I_Test, errorMessage: string): I_TestResult;
}

export interface I_Trial extends I_Named {
  getAssertionCount(): number;

  getFailureCount(): number;

  getIgnored(): any;

  getTestCount(): number;

  getTest(testName: string): I_Test;

  getTestResults(): I_TestResult[];

  getType(): TrialType;

  run(assertionCtxFactory: I_AssertionContextFactory, testResultFactory: I_TestResultFactory): I_Runnable;
}

export enum TrialType {
  ApiTrial,
  SourceFileTrial
}
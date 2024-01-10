import {
  createElement,
  ReactElement,
  ReactNode,
  ElementType,
  ReactHTML,
  InputHTMLAttributes,
  Attributes,
} from 'react';
import {incorporate} from './incorporate';

export interface PropsExtensions {
  sel?: string | symbol;
}

type PropsLike<P> = P & PropsExtensions & Attributes;

type Children = string | Array<ReactNode>;

function createElementSpreading(
  type: ElementType<InputHTMLAttributes<HTMLInputElement>> | keyof ReactHTML,
  props: PropsLike<InputHTMLAttributes<HTMLInputElement>> | null,
  children: Children
): ReactElement<InputHTMLAttributes<HTMLInputElement>> {
  if (typeof children === 'string') {
    return createElement(type, props, children);
  } else {
    return createElement(type, props, ...children);
  }
}

function hyperscriptProps<P = any>(
  type: ElementType<InputHTMLAttributes<HTMLInputElement>> | keyof ReactHTML,
  props: PropsLike<InputHTMLAttributes<HTMLInputElement>>
): ReactElement<InputHTMLAttributes<HTMLInputElement>> {
  if (!props.sel) {
    return createElement(type, props);
  } else {
    return createElement(incorporate(type), props);
  }
}

function hyperscriptChildren(
  type: ElementType<InputHTMLAttributes<HTMLInputElement>> | keyof ReactHTML,
  children: Children
): ReactElement<InputHTMLAttributes<HTMLInputElement>> {
  return createElementSpreading(type, null, children);
}

function hyperscriptPropsChildren(
  type: ElementType<InputHTMLAttributes<HTMLInputElement>> | keyof ReactHTML,
  props: PropsLike<InputHTMLAttributes<HTMLInputElement>>,
  children: Children
): ReactElement<InputHTMLAttributes<HTMLInputElement>> {
  if (!props.sel) {
    return createElementSpreading(type, props, children);
  } else {
    return createElementSpreading(incorporate(type), props, children);
  }
}

export function h(
  type: ElementType<InputHTMLAttributes<HTMLInputElement>> | keyof ReactHTML,
  a?: PropsLike<InputHTMLAttributes<HTMLInputElement>> | Children,
  b?: Children
): ReactElement<InputHTMLAttributes<HTMLInputElement>> {
  if (a === void 0 && b === void 0) {
    return createElement(type, null);
  }
  if (b === void 0 && (typeof a === 'string' || Array.isArray(a))) {
    return hyperscriptChildren(type, a as Array<ReactNode>);
  }
  if (b === void 0 && typeof a === 'object' && !Array.isArray(a)) {
    return hyperscriptProps(type, a);
  }
  if (
    a !== void 0 &&
    typeof a !== 'string' &&
    !Array.isArray(a) &&
    b !== void 0
  ) {
    return hyperscriptPropsChildren(type, a, b);
  } else {
    throw new Error('Unexpected usage of h() function');
  }
}

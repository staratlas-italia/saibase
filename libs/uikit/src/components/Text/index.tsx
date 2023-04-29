import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { MdTextProps, SmTextProps, XlTextProps, XsTextProps } from './types';
import { getAlignClasses } from './utils/getAlignClasses';
import { getOpacityClasses } from './utils/getOpacityClasses';
import { getSizeClasses } from './utils/getSizeClasses';
import { getWeightClasses } from './utils/getWeightClasses';

export type TextProps = PropsWithChildren<
  { shadow?: boolean } & Partial<
    XsTextProps & SmTextProps & MdTextProps & XlTextProps
  >
>;

export const Text = styled.span.attrs(
  ({
    align,
    color,
    decoration,
    hover,
    mdAlign,
    mdOpacity,
    mdSize,
    mdWeight,
    opacity,
    overflow,
    size,
    smAlign,
    smOpacity,
    smSize,
    smWeight,
    transform,
    weight,
    xlAlign,
    xlOpacity,
    xlSize,
    xlWeight,
  }: TextProps) => ({
    className: classNames(
      color,
      decoration,
      overflow,
      transform,
      getAlignClasses({ align }),
      getAlignClasses({ align: smAlign, size: 'sm' }),
      getAlignClasses({ align: mdAlign, size: 'md' }),
      getAlignClasses({ align: xlAlign, size: 'xl' }),
      getWeightClasses({ weight }),
      getWeightClasses({ weight: smWeight, size: 'sm' }),
      getWeightClasses({ weight: mdWeight, size: 'md' }),
      getWeightClasses({ weight: xlWeight, size: 'xl' }),
      getSizeClasses({ fontSize: size }),
      getSizeClasses({ fontSize: smSize, size: 'sm' }),
      getSizeClasses({ fontSize: mdSize, size: 'md' }),
      getSizeClasses({ fontSize: xlSize, size: 'xl' }),
      getOpacityClasses({ opacity }),
      getOpacityClasses({ opacity: smOpacity, size: 'sm' }),
      getOpacityClasses({ opacity: mdOpacity, size: 'md' }),
      getOpacityClasses({ opacity: xlOpacity, size: 'xl' }),
      {
        [`group-hover:opacity-90`]: hover,
      }
    ),
  })
)<TextProps>`
  ${({ shadow }) =>
    shadow &&
    css`
      text-shadow: 0 0 8px #5c5c5c;
    `}
`;

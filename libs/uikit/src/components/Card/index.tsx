import classNames from 'classnames';
import { Flex, FlexProps } from '../Flex';

type Props = FlexProps & {
  border?: boolean;
  className?: string;
  disableRound?: boolean;
};

export const Card = ({
  border,
  className,
  children,
  disableRound,
  ...props
}: Props) => {
  return (
    <Flex
      style={border ? { borderBottomRightRadius: 50 } : {}}
      className={classNames(className, 'relative z-10 bg-primary-dark', {
        'rounded-br-30px': !disableRound,
        'rounded-2xl': !disableRound,
        'border border-indigo-300': border,
      })}
      {...props}
    >
      {children}

      {border && (
        <div className="absolute w-12 h-12 -z-10	-bottom-px -right-px">
          <svg
            version="1.0"
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 56 56"
            data-src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMCIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1NiA1NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTYgNTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojMzMzMjM5O30KCS5zdDF7ZmlsbDojMUMxQjIxO30KPC9zdHlsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTU2LDB2MTguOWMwLDQuMi0xLjcsOC4zLTQuNywxMS4zTDMwLjIsNTEuM2MtMywzLTcuMSw0LjctMTEuMyw0LjdIMFYwSDU2eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTUsMHYxNy45YzAsNC4yLTEuNyw4LjMtNC43LDExLjNMMjkuMiw1MC4zYy0zLDMtNy4xLDQuNy0xMS4zLDQuN0gwVjBINTV6Ii8+Cjwvc3ZnPgo="
          >
            <path
              fill="currentColor"
              className="text-indigo-300"
              d="M56,0v18.9c0,4.2-1.7,8.3-4.7,11.3L30.2,51.3c-3,3-7.1,4.7-11.3,4.7H0V0H56z"
            />

            <path
              fill="currentColor"
              className="text-primary-dark"
              d="M55,0v17.9c0,4.2-1.7,8.3-4.7,11.3L29.2,50.3c-3,3-7.1,4.7-11.3,4.7H0V0H55z"
            />
          </svg>
        </div>
      )}
    </Flex>
  );
};

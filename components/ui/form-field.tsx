import { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { HTMLInputTypeAttribute } from 'react';
import MultipleSelector, { Option } from './multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';

const FormFieldInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: UseControllerProps<TFieldValues, TName> & {
    label?: string;
    type?: HTMLInputTypeAttribute;
    placeholder?: string;
    description?: string;
    className?: string;
  }
) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={props.className}>
          {props.label && <FormLabel disabled={props.disabled}>{props.label}</FormLabel>}
          <FormControl>
            <Input {...field} type={props.type} placeholder={props.placeholder} />
          </FormControl>
          {props.description && <FormDescription>{props.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

const FormFieldTextarea = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: UseControllerProps<TFieldValues, TName> & {
  label?: string;
  description?: string;
  maxLength?: number;
  rows?: number;
  className?: string;
}) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={props.className}>
          {props.label && <FormLabel disabled={props.disabled}>{props.label}</FormLabel>}
          <FormControl>
            <Textarea {...field} maxLength={props.maxLength} rows={props.rows} />
          </FormControl>
          <FormMessage />
          {props.description && <FormDescription>{props.description}</FormDescription>}
        </FormItem>
      )}
    ></FormField>
  );
};

export { FormFieldInput, FormFieldTextarea };

export const FormFieldMultiSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: UseControllerProps<TFieldValues, TName> & {
    label: string;
    placeholder?: string;
    options: Option[];
    creatable?: boolean;
    description?: string;
    hidePlaceholderWhenSelected?: boolean;
  }
) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel disabled={props.disabled}>{props.label}</FormLabel>
          <FormControl>
            <MultipleSelector
              {...field}
              defaultOptions={props.options}
              placeholder={props.placeholder}
              creatable={props.creatable}
              hidePlaceholderWhenSelected={props.hidePlaceholderWhenSelected}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-50 dark:text-gray-30">no results found.</p>
              }
            />
          </FormControl>
          <FormMessage />
          {props.description && <FormDescription>{props.description}</FormDescription>}
        </FormItem>
      )}
    ></FormField>
  );
};

export const FormFieldSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: UseControllerProps<TFieldValues, TName> & {
    label: string;
    placeholder?: string;
    options: Option[];
    description?: string;
  }
) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel disabled={props.disabled}>{props.label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {props.options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label ?? value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const FormFieldCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: UseControllerProps<TFieldValues, TName> & { label: string; description?: string }
) => {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
          <div className="flex gap-2 items-center">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel disabled={props.disabled} className="text-base font-normal">
              {props.label}
            </FormLabel>
          </div>
          <FormDescription>{props.description}</FormDescription>
        </FormItem>
      )}
    />
  );
};

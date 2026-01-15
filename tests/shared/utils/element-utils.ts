import { Page, Locator, expect } from '@playwright/test';

/**
 * Options for waitForElement function
 */
export interface WaitForElementOptions {
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Whether element should be visible (default: true) */
  visible?: boolean;
  /** Whether element should be hidden (default: false) */
  hidden?: boolean;
  /** Whether to wait for element to be attached to DOM (default: true) */
  attached?: boolean;
  /** Whether to wait for element to be detached from DOM (default: false) */
  detached?: boolean;
}

/**
 * Waits for an element to be visible (or meet other conditions)
 * @param page - Playwright Page object
 * @param selector - CSS selector, text, role, or locator string
 * @param options - Wait options
 * @returns The locator for the element
 * 
 * @example
 * ```typescript
 * // Wait for element by CSS selector
 * await waitForElement(page, '#my-button');
 * 
 * // Wait for element by role
 * await waitForElement(page, 'button', { name: 'Submit' });
 * 
 * // Wait with custom timeout
 * await waitForElement(page, '.loading', { timeout: 10000 });
 * ```
 */
export async function waitForElement(
  page: Page,
  selector: string | Locator,
  options: WaitForElementOptions & { name?: string } = {}
): Promise<Locator> {
  const {
    timeout = 30000,
    visible = true,
    hidden = false,
    attached = true,
    detached = false,
    name
  } = options;

  let locator: Locator;

  // If selector is already a Locator, use it directly
  if (typeof selector === 'string') {
    // If name is provided, assume it's a role selector
    if (name !== undefined) {
      locator = page.getByRole(selector as any, { name });
    } else {
      // Try to create locator from string (could be CSS selector or text)
      locator = page.locator(selector);
    }
  } else {
    locator = selector;
  }

  // Wait based on options
  if (hidden || detached) {
    await locator.waitFor({
      state: hidden ? 'hidden' : 'detached',
      timeout
    });
  } else {
    const state = visible && attached ? 'visible' : attached ? 'attached' : 'visible';
    await locator.waitFor({
      state,
      timeout
    });
  }

  return locator;
}

/**
 * Waits for an element to be visible (shorthand)
 * @param page - Playwright Page object
 * @param selector - CSS selector, text, role, or locator
 * @param options - Timeout in milliseconds (default: 30000) or options object
 * @returns The locator for the element
 * 
 * @example
 * ```typescript
 * // With timeout only
 * await waitForElementVisible(page, '#my-button', 10000);
 * 
 * // With options object (for role with name)
 * await waitForElementVisible(page, 'button', { name: 'Submit', timeout: 10000 });
 * ```
 */
export async function waitForElementVisible(
  page: Page,
  selector: string | Locator,
  options?: number | (WaitForElementOptions & { name?: string })
): Promise<Locator> {
  if (typeof options === 'number') {
    return waitForElement(page, selector, { timeout: options, visible: true });
  }
  return waitForElement(page, selector, { ...options, visible: true });
}

/**
 * Waits for an element to be hidden (shorthand)
 * @param page - Playwright Page object
 * @param selector - CSS selector, text, role, or locator
 * @param timeout - Timeout in milliseconds (default: 30000)
 * @returns The locator for the element
 */
export async function waitForElementHidden(
  page: Page,
  selector: string | Locator,
  timeout: number = 30000
): Promise<Locator> {
  return waitForElement(page, selector, { timeout, hidden: true });
}

/**
 * Options for selectCheckboxByOldestDate function
 */
export interface SelectCheckboxByOldestDateOptions {
  /** Column header name for the date column (default: 'Fecha Vto') */
  dateColumnHeader?: string;
  /** CSS selector for table rows (default: 'tr') */
  rowSelector?: string;
  /** CSS selector for checkboxes in rows (default: 'input[type="checkbox"]') */
  checkboxSelector?: string;
  /** CSS selector for the date cell (optional, will be found automatically if not provided) */
  dateCellSelector?: string;
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Whether to click the column header to sort (default: false) */
  sortByColumn?: boolean;
}

/**
 * Result from selectCheckboxByOldestDate function
 */
export interface SelectCheckboxByOldestDateResult {
  /** The locator of the selected checkbox */
  checkbox: Locator;
  /** The date text that was selected (e.g., "2023/03", "22/10/2025") */
  dateText: string;
  /** The parsed Date object */
  date: Date;
  /** The period text if found (e.g., "2025/05") */
  periodText?: string;
}

/**
 * Selects the checkbox for the row with the oldest due date
 * @param page - Playwright Page object
 * @param options - Configuration options
 * @returns Result object containing the checkbox locator and selected date information
 * 
 * @example
 * ```typescript
 * // Basic usage with default options
 * const result = await selectCheckboxByOldestDate(page);
 * console.log('Selected date:', result.dateText);
 * 
 * // With custom column name
 * const result = await selectCheckboxByOldestDate(page, { dateColumnHeader: 'Periodo' });
 * 
 * // With custom selectors
 * const result = await selectCheckboxByOldestDate(page, {
 *   rowSelector: '.table-row',
 *   checkboxSelector: '.checkbox',
 *   timeout: 60000
 * });
 * ```
 */
export async function selectCheckboxByOldestDate(
  page: Page,
  options: SelectCheckboxByOldestDateOptions = {}
): Promise<SelectCheckboxByOldestDateResult> {
  const {
    dateColumnHeader = 'Fecha Vto',
    rowSelector = 'tr',
    timeout = 30000,
    sortByColumn = false
  } = options;

  // Wait for table to load
  await page.waitForTimeout(2000);
  
  // Optionally sort by date column
  if (sortByColumn) {
    try {
      await page.getByRole('columnheader', { name: dateColumnHeader }).click();
      await page.waitForTimeout(1000);
    } catch (error) {
      console.warn(`No se pudo ordenar por "${dateColumnHeader}"`);
    }
  }

  // Find the specific table that contains "Fecha Vto" header
  const tableLocator = page.locator('table').filter({ has: page.getByRole('columnheader', { name: dateColumnHeader }) }).first();
  const tableExists = await tableLocator.count() > 0;
  
  if (!tableExists) {
    throw new Error(`No se encontró la tabla con el header "${dateColumnHeader}"`);
  }

  // Get all rows from the specific table - use evaluate to get data directly from DOM
  const rowsData = await tableLocator.evaluate((table, dateColumnHeader) => {
    // Find the header row to get column indices
    const headerRow = table.querySelector('thead tr, tr:first-child');
    if (!headerRow) return [];
    
    const headers = Array.from(headerRow.querySelectorAll('th, [role="columnheader"]'));
    const dateColumnIndex = headers.findIndex(h => {
      const text = h.textContent?.trim() || '';
      return text.includes(dateColumnHeader) || text.includes('Vencimiento') || text.includes('Vto');
    });
    
    const periodColumnIndex = headers.findIndex(h => {
      const text = h.textContent?.trim() || '';
      return text.includes('Periodo') || text.includes('Período');
    });
    
    // Get all data rows from this table only
    const rows = Array.from(table.querySelectorAll('tbody tr, tr:not(:first-child)'));
    const result: Array<{ rowIndex: number; dateText: string; periodText?: string; date: number }> = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = Array.from(row.querySelectorAll('td'));
      
      // Skip rows without data cells or header rows
      if (cells.length === 0) continue;
      
      let dateText: string | null = null;
      let periodText: string | undefined;
      
      // Get date from specific column if found, otherwise search all cells
      if (dateColumnIndex >= 0 && cells[dateColumnIndex]) {
        dateText = cells[dateColumnIndex].textContent?.trim() || null;
      } else {
        // Search all cells for date pattern DD/MM/YYYY
        for (const cell of cells) {
          const text = cell.textContent?.trim() || '';
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
            dateText = text;
            break;
          }
        }
      }
      
      // Get period from specific column if found
      if (periodColumnIndex >= 0 && cells[periodColumnIndex]) {
        const period = cells[periodColumnIndex].textContent?.trim() || '';
        if (/^\d{4}\/\d{2}$/.test(period)) {
          periodText = period;
        }
      } else {
        // Search all cells for period pattern YYYY/MM
        for (const cell of cells) {
          const text = cell.textContent?.trim() || '';
          if (/^\d{4}\/\d{2}$/.test(text)) {
            periodText = text;
            break;
          }
        }
      }
      
      // Prioritize period for comparison (period is more reliable for "oldest")
      if (periodText) {
        // Parse period (YYYY/MM format) - this is what we'll use to find the oldest
        const [periodYear, periodMonth] = periodText.split('/').map(Number);
        const periodDate = new Date(periodYear, periodMonth - 1, 1).getTime();
        
        if (!isNaN(periodDate)) {
          result.push({ rowIndex: i, dateText: dateText || '', periodText, date: periodDate });
        }
      } else if (dateText) {
        // Fallback: if no period, use date of vencimiento
        const [day, month, year] = dateText.split('/').map(Number);
        const date = new Date(year, month - 1, day).getTime();
        
        if (!isNaN(date)) {
          result.push({ rowIndex: i, dateText, periodText, date });
        }
      }
    }
    
    return result;
  }, dateColumnHeader);

  if (rowsData.length === 0) {
    throw new Error(`No se encontraron filas con fechas válidas en la tabla`);
  }

  // Find row with oldest period (or date if no period available)
  const oldestRowData = rowsData.reduce((oldest, current) => 
    current.date < oldest.date ? current : oldest
  );

  console.log(`✅ Período más antiguo encontrado: ${oldestRowData.periodText || oldestRowData.dateText} (Fecha Vto: ${oldestRowData.dateText || 'N/A'})`);

  // Get the actual row locator from the specific table
  const allRows = await tableLocator.locator('tbody tr, tr:not(:first-child)').all();
  const oldestRow = allRows[oldestRowData.rowIndex];
  
  if (!oldestRow) {
    throw new Error(`No se pudo encontrar la fila en el índice ${oldestRowData.rowIndex} de la tabla`);
  }

  // Scroll and click checkbox
  await oldestRow.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Find and click checkbox
  const checkbox = oldestRow.locator('.v-input--selection-controls__ripple').first();
  const checkboxCount = await checkbox.count();
  
  if (checkboxCount === 0) {
    // Fallback: try empty cell
    const emptyCell = oldestRow.getByRole('cell').filter({ hasText: /^$/ }).first();
    const cellCount = await emptyCell.count();
    if (cellCount > 0) {
      await emptyCell.click();
    } else {
      throw new Error(`No se pudo encontrar el checkbox en la fila con fecha ${oldestRowData.dateText}`);
    }
  } else {
    await checkbox.click();
  }

  return {
    checkbox,
    dateText: oldestRowData.dateText,
    date: new Date(oldestRowData.date),
    periodText: oldestRowData.periodText
  };
}

/**
 * Normalizes a CUIT number by removing hyphens and spaces
 */
function normalizeCUIT(cuit: string): string {
  return cuit.replace(/[-\s]/g, '');
}

/**
 * Finds and selects a CUIT option in a combobox
 * @param page - Playwright Page object
 * @param expectedCUIT - The CUIT to select (e.g., '30685889397')
 * @param options - Configuration options
 * @returns The selected option information
 */
export async function selectCUITFromCombobox(
  page: Page,
  expectedCUIT: string,
  options: { timeout?: number } = {}
): Promise<{ value: string; text: string }> {
  const { timeout = 30000 } = options;
  const combobox = page.getByRole('combobox');
  const normalizedExpected = normalizeCUIT(expectedCUIT);
  
  // Wait for combobox to be visible and ready
  await combobox.waitFor({ state: 'visible', timeout });
  await page.waitForTimeout(1000); // Wait for options to load
  
  // First, try to get options using evaluate (more reliable for standard select elements)
  const optionsData = await combobox.evaluate((select: HTMLSelectElement | HTMLElement) => {
    if (select instanceof HTMLSelectElement && select.options.length > 0) {
      return Array.from(select.options).map((opt) => ({
        value: opt.value,
        text: opt.textContent || ''
      }));
    }
    return null;
  }).catch(() => null);
  
  // If we got options using evaluate, use them
  if (optionsData && optionsData.length > 0) {
    // Find matching option
    for (const opt of optionsData) {
      const normalizedValue = normalizeCUIT(opt.value);
      const normalizedText = opt.text.replace(/[-\s\[\]]/g, '');
      
      if (normalizedValue === normalizedExpected || normalizedText.includes(normalizedExpected)) {
        await combobox.selectOption({ value: opt.value });
        await page.waitForTimeout(2000);
        
        // Verify selection
        const selectedValue = await combobox.evaluate((el: HTMLSelectElement) => el.value).catch(() => '');
        const normalizedSelected = normalizeCUIT(selectedValue);
        
        if (normalizedSelected !== normalizedExpected) {
          throw new Error(`El CUIT seleccionado no coincide. Esperado: ${expectedCUIT}, pero se seleccionó: ${selectedValue}`);
        }
        
        console.log(`✅ CUIT "${expectedCUIT}" seleccionado correctamente. Valor: "${opt.value}", Texto: "${opt.text}"`);
        return { value: opt.value, text: opt.text };
      }
    }
    
    // If no match found, show available options
    const optionsList = optionsData.slice(0, 10).map((opt, idx) => 
      `[${idx}] value="${opt.value}" text="${opt.text}"`
    ).join('\n');
    console.error(`❌ No se encontró la opción con CUIT "${expectedCUIT}"`);
    console.error(`   Opciones disponibles:\n${optionsList}`);
    throw new Error(`No se encontró la opción con CUIT "${expectedCUIT}" en el combobox`);
  }
  
  // Fallback: try using locators (for custom comboboxes)
  let allOptions: Locator[] = [];
  let optionCount = 0;
  
  try {
    // First try standard select options
    optionCount = await combobox.locator('option').count();
    if (optionCount > 0) {
      allOptions = await combobox.locator('option').all();
    }
  } catch (error) {
    // If that fails, try alternative selectors
    try {
      optionCount = await combobox.locator('[role="option"]').count();
      if (optionCount > 0) {
        allOptions = await combobox.locator('[role="option"]').all();
      }
    } catch (err) {
      console.warn('Error al obtener opciones del combobox:', err);
    }
  }
  
  if (optionCount === 0 || allOptions.length === 0) {
    // Try to get options from the page context (for dropdowns that open on click)
    const selectElement = await combobox.evaluateHandle((el) => {
      if (el instanceof HTMLSelectElement) {
        return el;
      }
      return null;
    }).catch(() => null);
    
    if (!selectElement) {
      throw new Error(`No se encontraron opciones en el combobox. El combobox puede no ser un elemento <select> estándar o las opciones aún no se han cargado.`);
    }
    
    // If it's a select element, get options directly
    const options = await combobox.evaluate((select: HTMLSelectElement) => {
      return Array.from(select.options).map((opt, idx) => ({
        index: idx,
        value: opt.value,
        text: opt.textContent || ''
      }));
    });
    
    // Find matching option
    for (const opt of options) {
      const normalizedValue = normalizeCUIT(opt.value);
      const normalizedText = opt.text.replace(/[-\s\[\]]/g, '');
      
      if (normalizedValue === normalizedExpected || normalizedText.includes(normalizedExpected)) {
        await combobox.selectOption({ value: opt.value });
        await page.waitForTimeout(2000);
        
        // Verify selection
        const selectedValue = await combobox.evaluate((el: HTMLSelectElement) => el.value).catch(() => '');
        const normalizedSelected = normalizeCUIT(selectedValue);
        
        if (normalizedSelected !== normalizedExpected) {
          throw new Error(`El CUIT seleccionado no coincide. Esperado: ${expectedCUIT}, pero se seleccionó: ${selectedValue}`);
        }
        
        console.log(`✅ CUIT "${expectedCUIT}" seleccionado correctamente. Valor: "${opt.value}", Texto: "${opt.text}"`);
        return { value: opt.value, text: opt.text };
      }
    }
    
    throw new Error(`No se encontró la opción con CUIT "${expectedCUIT}" en el combobox`);
  }
  let foundOption: { value: string; text: string; index: number } | null = null;
  
  // Find the option that matches the CUIT
  for (let idx = 0; idx < allOptions.length; idx++) {
    const option = allOptions[idx];
    const valueAttr = await option.getAttribute('value').catch(() => null);
    const textContent = await option.textContent().catch(() => null);
    const value = valueAttr || '';
    const text = textContent || '';
    
    const normalizedValue = normalizeCUIT(value);
    const normalizedText = text.replace(/[-\s\[\]]/g, '');
    
    if (normalizedValue === normalizedExpected || normalizedText.includes(normalizedExpected)) {
      foundOption = { value, text, index: idx };
      break;
    }
  }
  
  if (!foundOption) {
    const optionsList = await Promise.all(
      allOptions.slice(0, 10).map(async (opt, idx) => {
        const val = await opt.getAttribute('value').catch(() => '');
        const txt = await opt.textContent().catch(() => '') || '';
        return `[${idx}] value="${val}" text="${txt}"`;
      })
    );
    console.error(`❌ No se encontró la opción con CUIT "${expectedCUIT}"`);
    console.error(`   Opciones disponibles:\n${optionsList.join('\n')}`);
    throw new Error(`No se encontró la opción con CUIT "${expectedCUIT}" en el combobox`);
  }
  
  // Select the found option
  await combobox.selectOption({ value: foundOption.value });
  await page.waitForTimeout(2000);
  
  // Verify the selected value is correct
  const selectedValue = await combobox.evaluate((el: HTMLSelectElement) => el.value).catch(() => '');
  const normalizedSelected = normalizeCUIT(selectedValue);
  
  if (normalizedSelected !== normalizedExpected) {
    const selectedOptionText = await combobox.locator('option:checked').textContent().catch(() => '') || '';
    console.error(`❌ CUIT incorrecto seleccionado.`);
    console.error(`   Esperado: "${expectedCUIT}" (valor: "${foundOption.value}")`);
    console.error(`   Seleccionado: valor="${selectedValue}", texto="${selectedOptionText}"`);
    throw new Error(`El CUIT seleccionado no coincide. Esperado: ${expectedCUIT}, pero se seleccionó: ${selectedValue}`);
  }
  
  console.log(`✅ CUIT "${expectedCUIT}" seleccionado correctamente. Valor: "${foundOption.value}", Texto: "${foundOption.text}"`);
  
  return { value: foundOption.value, text: foundOption.text };
}

/**
 * Verifies that a CUIT is present on the page after navigation
 * @param page - Playwright Page object
 * @param expectedCUIT - The CUIT to verify
 * @param options - Configuration options
 */
export async function verifyCUITOnPage(
  page: Page,
  expectedCUIT: string,
  options: { timeout?: number; waitAfterNavigation?: number } = {}
): Promise<void> {
  const { timeout = 10000, waitAfterNavigation = 3000 } = options;
  const normalizedExpected = normalizeCUIT(expectedCUIT);
  
  await page.waitForTimeout(waitAfterNavigation);
  
  const pageText = await page.textContent('body').catch(() => '') || '';
  const normalizedPageText = normalizeCUIT(pageText);
  
  if (!normalizedPageText.includes(normalizedExpected)) {
    console.error(`❌ Después de navegar, el CUIT "${expectedCUIT}" no se encuentra en la página.`);
    console.error(`   Esto sugiere que se seleccionó un CUIT diferente.`);
    throw new Error(`El CUIT "${expectedCUIT}" no está presente en la página después de navegar. Se seleccionó un CUIT diferente.`);
  }
  
  console.log(`✅ CUIT "${expectedCUIT}" verificado en la página de destino.`);
}

/**
 * Validates domain and period in the confirmation screen
 * @param page - Playwright Page object
 * @param expectedDomain - The domain to verify
 * @param expectedPeriod - The period to verify
 */
export async function validateConfirmationData(
  page: Page,
  expectedDomain: string,
  expectedPeriod?: string
): Promise<void> {
  // Find the table row that contains both domain and period (if period provided)
  let domainCell;
  
  if (expectedPeriod) {
    // If period is provided, find the row that contains both domain and period
    const escapedPeriod = expectedPeriod.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rowWithPeriod = page.locator('tr').filter({ 
      has: page.getByRole('cell').filter({ hasText: new RegExp(escapedPeriod) })
    });
    
    // Find domain cell in the same row
    domainCell = rowWithPeriod.getByRole('cell', { name: expectedDomain });
    
    // Validate period in the same row
    const periodCell = rowWithPeriod.getByRole('cell').filter({ hasText: new RegExp(escapedPeriod) });
    await expect(periodCell.first()).toBeVisible({ timeout: 10000 });
    
    const periodText = await periodCell.first().textContent();
    expect(periodText).toContain(expectedPeriod);
    
    console.log(`✅ Validated period: ${expectedPeriod} is displayed in confirmation screen`);
  } else {
    // If no period, just find any cell with the domain (use first one)
    domainCell = page.getByRole('cell', { name: expectedDomain }).first();
  }
  
  // Validate domain
  await expect(domainCell).toBeVisible({ timeout: 10000 });
  await expect(domainCell).toContainText(expectedDomain);
  
  console.log(`✅ Validated domain: ${expectedDomain} is displayed in confirmation screen`);
}

/**
 * Options for clickWithErrorRetry function
 */
export interface ClickWithErrorRetryOptions {
  /** Maximum number of retries (default: 2) */
  maxRetries?: number;
  /** Wait time after click in milliseconds (default: 2000) */
  waitAfterClick?: number;
  /** Wait time after cancel in milliseconds (default: 1000) */
  waitAfterCancel?: number;
}

/**
 * Clicks on "Compensar Saldo" link with automatic retry if error appears
 * @param page - Playwright Page object
 * @param options - Configuration options
 */
export async function clickCompensarSaldoWithRetry(
  page: Page,
  options: ClickWithErrorRetryOptions = {}
): Promise<void> {
  const {
    maxRetries = 2,
    waitAfterClick = 2000,
    waitAfterCancel = 1000
  } = options;

  const errorText = 'Actualmente no podemos efectuar esta consulta';
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    await page.getByRole('link', { name: 'Compensar Saldo' }).click();
    await page.waitForTimeout(waitAfterClick);

    // Check if error message appears - only proceed with cancel if error is actually visible
    const errorMessage = page.getByText(errorText, { exact: false });
    const errorCount = await errorMessage.count({ timeout: 3000 }).catch(() => 0);
    
    let errorVisible = false;
    if (errorCount > 0) {
      // Only check visibility if element exists, with timeout to avoid hanging
      errorVisible = await errorMessage.first().isVisible({ timeout: 2000 }).catch(() => false);
    }

    // Only handle error if it actually appeared
    if (errorVisible && retryCount < maxRetries) {
      console.log(`⚠️ Error detectado: "${errorText}". Reintentando (${retryCount + 1}/${maxRetries})...`);
      
      // Verify Cancel button exists before clicking
      const cancelButton = page.getByRole('button', { name: 'Cancelar' });
      const cancelExists = await cancelButton.count({ timeout: 2000 }).catch(() => 0) > 0;
      
      if (cancelExists) {
        await cancelButton.click({ timeout: 5000 });
        await page.waitForTimeout(waitAfterCancel);
        retryCount++;
      } else {
        throw new Error(`Error "${errorText}" apareció pero no se encontró el botón "Cancelar"`);
      }
    } else if (errorVisible && retryCount >= maxRetries) {
      throw new Error(`Error "${errorText}" persistió después de ${maxRetries + 1} intentos`);
    } else {
      // No error appeared, success - exit the loop
      console.log('✅ "Compensar Saldo" clickeado exitosamente sin errores');
      break;
    }
  }
}

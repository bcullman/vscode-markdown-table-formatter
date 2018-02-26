"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wcswidth = require("wcwidth");
const vscode = require("vscode");
function swidth(str) {
    const zwcrx = /[\u200B-\u200D\uFEFF\u00AD]/g;
    const match = str.match(zwcrx);
    return wcswidth(str) - (match ? match.length : 0);
}
function padding(len, str = ' ') {
    return str.repeat(len);
}
const stripTailPipes = (str) => str.trim().replace(/(^\||\|$)/g, '');
const splitCells = (str) => str.split('|');
const addTailPipes = (str) => `|${str}|`;
const joinCells = (arr) => arr.join('|');
const tableJustMap = {
    Left: ':-',
    Center: '::',
    Right: '-:'
};
function formatTable(text, settings) {
    const addTailPipesIfNeeded = settings.keepFirstAndLastPipes
        ? addTailPipes
        : (x) => x;
    let formatline = text[2].trim();
    const headerline = text[1].trim();
    let formatrow;
    let data;
    if (headerline.length === 0) {
        formatrow = 0;
        data = text[3];
    }
    else {
        formatrow = 1;
        data = text[1] + text[3];
    }
    const lines = data.trim().split(/\r?\n/);
    const justify = splitCells(stripTailPipes(formatline)).map(cell => {
        const trimmed = cell.trim();
        const first = trimmed[0];
        const last = trimmed[trimmed.length - 1];
        const ends = (first || ':') + (last || '-');
        if (ends === '--') {
            return tableJustMap[settings.defaultTableJustification];
        }
        else {
            return ends;
        }
    });
    const columns = justify.length;
    const colArr = Array.from(Array(columns));
    const cellPadding = padding(settings.spacePadding);
    const content = lines.map(line => {
        const cells = splitCells(stripTailPipes(line));
        if (columns - cells.length > 0) {
            cells.push(...Array(columns - cells.length).fill(''));
        }
        else if (columns - cells.length < 0) {
            cells[columns - 1] = joinCells(cells.slice(columns - 1));
        }
        return cells.map(cell => `${cellPadding}${cell.trim()}${cellPadding}`);
    });
    const widths = colArr.map((_x, i) => Math.max(2, ...content.map(cells => swidth(cells[i]))));
    if (settings.limitLastColumnPadding) {
        const preferredLineLength = vscode.workspace.getConfiguration('editor').get('wordWrapColumn');
        const sum = (arr) => arr.reduce((x, y) => x + y, 0);
        const wsum = sum(widths);
        if (wsum > preferredLineLength) {
            const prewsum = sum(widths.slice(0, -1));
            widths[widths.length - 1] = Math.max(preferredLineLength - prewsum - widths.length - 1, 3);
        }
    }
    const just = function (str, col) {
        const length = Math.max(widths[col] - swidth(str), 0);
        switch (justify[col]) {
            case '::':
                return padding(length / 2) + str + padding((length + 1) / 2);
            case '-:':
                return padding(length) + str;
            case ':-':
                return str + padding(length);
            default:
                throw new Error(`Unknown column justification ${justify[col]}`);
        }
    };
    const formatted = content.map(cells => addTailPipesIfNeeded(joinCells(colArr.map((_x, i) => just(cells[i], i)))));
    formatline = addTailPipesIfNeeded(joinCells(colArr.map((_x, i) => {
        const [front, back] = justify[i];
        return front + padding(widths[i] - 2, '-') + back;
    })));
    formatted.splice(formatrow, 0, formatline);
    return ((formatrow === 0 && text[1] !== '' ? '\n' : '') +
        formatted.join('\n') +
        '\n');
}
exports.formatTable = formatTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXRhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Zvcm1hdC10YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9DQUFxQztBQUNyQyxpQ0FBaUM7QUFHakMsZ0JBQWdCLEdBQVc7SUFHdkIsTUFBTSxLQUFLLEdBQUcsOEJBQThCLENBQUM7SUFDN0MsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUQsaUJBQWlCLEdBQVcsRUFBRSxNQUFjLEdBQUc7SUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUNELE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3RSxNQUFNLFVBQVUsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuRCxNQUFNLFlBQVksR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNqRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQWEsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUVuRCxNQUFNLFlBQVksR0FBOEI7SUFDNUMsSUFBSSxFQUFFLElBQUk7SUFDVixNQUFNLEVBQUUsSUFBSTtJQUNaLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQUVGLHFCQUNJ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QUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUNMLENBQ0osQ0FBQztJQUVGLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUUzQyxNQUFNLENBQUMsQ0FDSCxDQUFDLFNBQVMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDcEIsSUFBSSxDQUNQLENBQUM7QUFDTixDQUFDO0FBeEdELGtDQXdHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB3Y3N3aWR0aCA9IHJlcXVpcmUoJ3djd2lkdGgnKTtcbmltcG9ydCAqIGFzIHZzY29kZSBmcm9tICd2c2NvZGUnO1xuaW1wb3J0IHsgTWFya2Rvd25UYWJsZUZvcm1hdHRlclNldHRpbmdzIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcblxuZnVuY3Rpb24gc3dpZHRoKHN0cjogc3RyaW5nKSB7XG4gICAgLy8gemVyby13aWR0aCBVbmljb2RlIGNoYXJhY3RlcnMgdGhhdCB3ZSBzaG91bGQgaWdub3JlIGZvclxuICAgIC8vIHB1cnBvc2VzIG9mIGNvbXB1dGluZyBzdHJpbmcgXCJkaXNwbGF5XCIgd2lkdGhcbiAgICBjb25zdCB6d2NyeCA9IC9bXFx1MjAwQi1cXHUyMDBEXFx1RkVGRlxcdTAwQURdL2c7XG4gICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2goendjcngpO1xuICAgIHJldHVybiB3Y3N3aWR0aChzdHIpIC0gKG1hdGNoID8gbWF0Y2gubGVuZ3RoIDogMCk7XG59XG5cbmZ1bmN0aW9uIHBhZGRpbmcobGVuOiBudW1iZXIsIHN0cjogc3RyaW5nID0gJyAnKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBlYXQobGVuKTtcbn1cbmNvbnN0IHN0cmlwVGFpbFBpcGVzID0gKHN0cjogc3RyaW5nKSA9PiBzdHIudHJpbSgpLnJlcGxhY2UoLyheXFx8fFxcfCQpL2csICcnKTtcbmNvbnN0IHNwbGl0Q2VsbHMgPSAoc3RyOiBzdHJpbmcpID0+IHN0ci5zcGxpdCgnfCcpO1xuY29uc3QgYWRkVGFpbFBpcGVzID0gKHN0cjogc3RyaW5nKSA9PiBgfCR7c3RyfXxgO1xuY29uc3Qgam9pbkNlbGxzID0gKGFycjogc3RyaW5nW10pID0+IGFyci5qb2luKCd8Jyk7XG5cbmNvbnN0IHRhYmxlSnVzdE1hcDogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICBMZWZ0OiAnOi0nLFxuICAgIENlbnRlcjogJzo6JyxcbiAgICBSaWdodDogJy06J1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRhYmxlKFxuICAgIHRleHQ6IFJlZ0V4cEV4ZWNBcnJheSxcbiAgICBzZXR0aW5nczogTWFya2Rvd25UYWJsZUZvcm1hdHRlclNldHRpbmdzLFxuKSB7XG4gICAgY29uc3QgYWRkVGFpbFBpcGVzSWZOZWVkZWQgPSBzZXR0aW5ncy5rZWVwRmlyc3RBbmRMYXN0UGlwZXNcbiAgICAgICAgPyBhZGRUYWlsUGlwZXNcbiAgICAgICAgOiAoeDogc3RyaW5nKSA9PiB4O1xuXG4gICAgbGV0IGZvcm1hdGxpbmUgPSB0ZXh0WzJdLnRyaW0oKTtcbiAgICBjb25zdCBoZWFkZXJsaW5lID0gdGV4dFsxXS50cmltKCk7XG5cbiAgICBsZXQgZm9ybWF0cm93OiBudW1iZXI7XG4gICAgbGV0IGRhdGE6IHN0cmluZztcbiAgICBpZiAoaGVhZGVybGluZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZm9ybWF0cm93ID0gMDtcbiAgICAgICAgZGF0YSA9IHRleHRbM107XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybWF0cm93ID0gMTtcbiAgICAgICAgZGF0YSA9IHRleHRbMV0gKyB0ZXh0WzNdO1xuICAgIH1cbiAgICBjb25zdCBsaW5lcyA9IGRhdGEudHJpbSgpLnNwbGl0KC9cXHI/XFxuLyk7XG5cbiAgICBjb25zdCBqdXN0aWZ5ID0gc3BsaXRDZWxscyhzdHJpcFRhaWxQaXBlcyhmb3JtYXRsaW5lKSkubWFwKGNlbGwgPT4ge1xuICAgICAgICBjb25zdCB0cmltbWVkID0gY2VsbC50cmltKCk7XG4gICAgICAgIGNvbnN0IGZpcnN0ID0gdHJpbW1lZFswXTtcbiAgICAgICAgY29uc3QgbGFzdCA9IHRyaW1tZWRbdHJpbW1lZC5sZW5ndGggLSAxXTtcbiAgICAgICAgY29uc3QgZW5kcyA9IChmaXJzdCB8fCAnOicpICsgKGxhc3QgfHwgJy0nKTtcblxuICAgICAgICBpZiAoZW5kcyA9PT0gJy0tJykge1xuICAgICAgICAgICAgcmV0dXJuIHRhYmxlSnVzdE1hcFtzZXR0aW5ncy5kZWZhdWx0VGFibGVKdXN0aWZpY2F0aW9uXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBlbmRzO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBjb2x1bW5zID0ganVzdGlmeS5sZW5ndGg7XG4gICAgY29uc3QgY29sQXJyOiB1bmRlZmluZWRbXSA9IEFycmF5LmZyb20oQXJyYXkoY29sdW1ucykpO1xuXG4gICAgY29uc3QgY2VsbFBhZGRpbmcgPSBwYWRkaW5nKHNldHRpbmdzLnNwYWNlUGFkZGluZyk7XG5cbiAgICBjb25zdCBjb250ZW50ID0gbGluZXMubWFwKGxpbmUgPT4ge1xuICAgICAgICBjb25zdCBjZWxscyA9IHNwbGl0Q2VsbHMoc3RyaXBUYWlsUGlwZXMobGluZSkpO1xuICAgICAgICBpZiAoY29sdW1ucyAtIGNlbGxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIHBhZCByb3dzIHRvIGhhdmUgYGNvbHVtbnNgIGNlbGxzXG4gICAgICAgICAgICBjZWxscy5wdXNoKC4uLkFycmF5KGNvbHVtbnMgLSBjZWxscy5sZW5ndGgpLmZpbGwoJycpKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2x1bW5zIC0gY2VsbHMubGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgLy8gcHV0IGFsbCBleHRyYSBjb250ZW50IGludG8gbGFzdCBjZWxsXG4gICAgICAgICAgICBjZWxsc1tjb2x1bW5zIC0gMV0gPSBqb2luQ2VsbHMoY2VsbHMuc2xpY2UoY29sdW1ucyAtIDEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbHMubWFwKGNlbGwgPT4gYCR7Y2VsbFBhZGRpbmd9JHtjZWxsLnRyaW0oKX0ke2NlbGxQYWRkaW5nfWApO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgd2lkdGhzID0gY29sQXJyLm1hcCgoX3gsIGkpID0+XG4gICAgICAgIE1hdGgubWF4KDIsIC4uLmNvbnRlbnQubWFwKGNlbGxzID0+IHN3aWR0aChjZWxsc1tpXSkpKSxcbiAgICApO1xuXG4gICAgaWYgKHNldHRpbmdzLmxpbWl0TGFzdENvbHVtblBhZGRpbmcpIHtcbiAgICAgICAgY29uc3QgcHJlZmVycmVkTGluZUxlbmd0aCA9IDxudW1iZXI+dnNjb2RlLndvcmtzcGFjZS5nZXRDb25maWd1cmF0aW9uKCdlZGl0b3InKS5nZXQoJ3dvcmRXcmFwQ29sdW1uJyk7XG4gICAgICAgIGNvbnN0IHN1bSA9IChhcnI6IG51bWJlcltdKSA9PiBhcnIucmVkdWNlKCh4LCB5KSA9PiB4ICsgeSwgMCk7XG4gICAgICAgIGNvbnN0IHdzdW0gPSBzdW0od2lkdGhzKTtcbiAgICAgICAgaWYgKHdzdW0gPiBwcmVmZXJyZWRMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV3c3VtID0gc3VtKHdpZHRocy5zbGljZSgwLCAtMSkpO1xuICAgICAgICAgICAgd2lkdGhzW3dpZHRocy5sZW5ndGggLSAxXSA9IE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIHByZWZlcnJlZExpbmVMZW5ndGggLSBwcmV3c3VtIC0gd2lkdGhzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyBOZWVkIGF0IGxlYXN0IDotLSBmb3IgZ2l0aHViIHRvIHJlY29nbml6ZSBhIGNvbHVtblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QganVzdCA9IGZ1bmN0aW9uIChzdHI6IHN0cmluZywgY29sOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gTWF0aC5tYXgod2lkdGhzW2NvbF0gLSBzd2lkdGgoc3RyKSwgMCk7XG4gICAgICAgIHN3aXRjaCAoanVzdGlmeVtjb2xdKSB7XG4gICAgICAgICAgICBjYXNlICc6Oic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZGRpbmcobGVuZ3RoIC8gMikgKyBzdHIgKyBwYWRkaW5nKChsZW5ndGggKyAxKSAvIDIpO1xuICAgICAgICAgICAgY2FzZSAnLTonOlxuICAgICAgICAgICAgICAgIHJldHVybiBwYWRkaW5nKGxlbmd0aCkgKyBzdHI7XG4gICAgICAgICAgICBjYXNlICc6LSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0ciArIHBhZGRpbmcobGVuZ3RoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGNvbHVtbiBqdXN0aWZpY2F0aW9uICR7anVzdGlmeVtjb2xdfWApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGZvcm1hdHRlZCA9IGNvbnRlbnQubWFwKGNlbGxzID0+XG4gICAgICAgIGFkZFRhaWxQaXBlc0lmTmVlZGVkKGpvaW5DZWxscyhjb2xBcnIubWFwKChfeCwgaSkgPT4ganVzdChjZWxsc1tpXSwgaSkpKSksXG4gICAgKTtcblxuICAgIGZvcm1hdGxpbmUgPSBhZGRUYWlsUGlwZXNJZk5lZWRlZChcbiAgICAgICAgam9pbkNlbGxzKFxuICAgICAgICAgICAgY29sQXJyLm1hcCgoX3gsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBbZnJvbnQsIGJhY2tdID0ganVzdGlmeVtpXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnJvbnQgKyBwYWRkaW5nKHdpZHRoc1tpXSAtIDIsICctJykgKyBiYWNrO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgKTtcblxuICAgIGZvcm1hdHRlZC5zcGxpY2UoZm9ybWF0cm93LCAwLCBmb3JtYXRsaW5lKTtcblxuICAgIHJldHVybiAoXG4gICAgICAgIChmb3JtYXRyb3cgPT09IDAgJiYgdGV4dFsxXSAhPT0gJycgPyAnXFxuJyA6ICcnKSArXG4gICAgICAgIGZvcm1hdHRlZC5qb2luKCdcXG4nKSArXG4gICAgICAgICdcXG4nXG4gICAgKTtcbn0iXX0=
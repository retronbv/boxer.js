const wrapAnsi = require("wrap-ansi");
const chalk = require("chalk");
const boxen = require("boxen");
const maxCharsPerLine = () => ((process.stdout.columns || 100) * 80) / 100;

function indent(count, chr = " ") {
  return chr.repeat(count);
}

function indentLines(string, spaces, firstLineSpaces) {
  const lines = Array.isArray(string) ? string : string.split("\n");
  let s = "";
  if (lines.length) {
    const i0 = indent(firstLineSpaces === undefined ? spaces : firstLineSpaces);
    s = i0 + lines.shift();
  }
  if (lines.length) {
    const i = indent(spaces);
    s += "\n" + lines.map((l) => i + l).join("\n");
  }
  return s;
}

function foldLines(
  string,
  spaces,
  firstLineSpaces,
  charsPerLine = maxCharsPerLine()
) {
  return indentLines(wrapAnsi(string, charsPerLine), spaces, firstLineSpaces);
}

function colorize(text) {
  return text
    .replace(/\[[^ ]+]/g, (m) => chalk.grey(m))
    .replace(/<[^ ]+>/g, (m) => chalk.green(m))
    .replace(/ (-[-\w,]+)/g, (m) => chalk.bold(m))
    .replace(/`([^`]+)`/g, (_, m) => chalk.bold.cyan(m));
}

function box(message, name, options) {
  return (
    boxen(
      [
        chalk.white(name),
        "",
        chalk.white(foldLines(message, 0, 0, maxCharsPerLine())),
      ].join("\n"),
      Object.assign(
        {
          borderColor: "white",
          borderStyle: "double",
          padding: 1,
          margin: 1,
        },
        options
      )
    ) + "\n"
  );
}

function successBox(message, name) {
  return box(
    message,
    chalk.green("✔  " + name + " Success"),
    {
      borderColor: "green",
    }
  );
}

function warningBox(message, name) {
  return box(
    message,
    chalk.yellow("⚠ " + name + " Warning"),
    {
      borderColor: "yellow",
    }
  );
}

function errorBox(message, name) {
  return box(message, chalk.red("✖ " + name + " Error"), {
    borderColor: "red",
  });
}

function fatalBox(message, name) {
  return errorBox(
    message,
    chalk.red(" " + name + " Fatal")
  );
}
module.exports = { fatalBox, successBox, warningBox, errorBox };
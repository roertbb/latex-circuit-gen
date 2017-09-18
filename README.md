# latex-circuit-gen

Small graphical interface made to generate circuits in latex.

## Usage

In order to make that working in latex download proper package from [circuitikz repo](http://circuitikz.github.io/circuitikz/) (tested on version 0.8.3). Then copy `circuitikz.sty` into your project's directory and include it in your document:

```latex
\usepackage{circuitikzgit}
```

Then copy generated code in `circuitikz` environment:

```
\begin{circuitikz}
    %copy code here
\end{circuitikz}
```

In case you need more components or want to edit generated code, visit [circuitikz lastest compiled documentation](http://circuitikz.github.io/circuitikz/circuitikzmanualgit.pdf)



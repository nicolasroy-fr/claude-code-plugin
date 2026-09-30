---
name: python-test-generator
description: Generate unit tests (pytest) for Python code following strict conventions for file location, naming, and with/when/then structure. Use when the user asks to write, generate, or add tests for a Python module, function, or class (« génère des tests », « écris les tests de ce module »).
---

# Python test generator

Generate pytest unit tests for Python code. Follow every rule below.

## 1. Where tests live

- Tests go in a `tests/` folder **at the same level as the tested module**.

  ```
  pkg/
    service.py
    tests/
      test_service.py
  ```
- Create `tests/` (and `tests/__init__.py` if the project's other test folders use one) when missing.
- If `tests/` already exists, reuse it and match its existing style.

## 2. Test file naming

- The test file is named after the module, prefixed with `test_`: `service.py` → `tests/test_service.py`.
- **If the file would contain too many tests** (rule of thumb: > ~300 lines or > ~20 tests, or several clearly distinct concerns), split it into a sub-folder named after the module, with one file per function/class/theme under test:

  ```
  pkg/
    service.py
    tests/
      service/
        test_create_user.py
        test_delete_user.py
  ```
  Do not keep both `test_service.py` and `tests/service/` — migrate existing tests into the folder.

## 3. Test naming

Pattern (double underscores as separators):

```
test__<function_name>__<test_case>
test__<function_name>__<test_case>__<sub_case>
```

Examples: `test__parse_date__nominal`, `test__parse_date__invalid_format__empty_string`.
For methods, use `<function_name>` = `<method_name>` (prefix with the class in the file/class grouping if ambiguous, e.g. `test__save__nominal` inside `class TestUser`).

## 4. Structure: with / when / then

Every test has three sections, marked by comments, in this order:

```python
def test__add__nominal():
    # with
    a, b = 2, 3

    # when
    result = add(a, b)

    # then
    assert result == 5
```

- `# with`: everything needed (inputs, fixtures, mocks, objects).
- `# when`: the single call under test, result stored in a variable.
- `# then`: the assertions only.
- Always keep all three comments, even if `# with` is short (put the input values there).

## 5. Assertions

- For general cases, prefer **attribute-by-attribute assertions** over comparing whole objects:

  ```python
  # then
  assert user.name == "Alice"
  assert user.email == "alice@example.com"
  assert user.active is True
  ```
- Whole-object equality is acceptable only for simple values (int, str, list of primitives) or when equality is the behaviour being tested.
- Exceptions: `with pytest.raises(...) as exc_info:` in the `# when` section, then assert on `exc_info.value` (type/message/attributes) in `# then`.

## 6. Coverage

When relevant, cover:
- **Nominal cases**: typical valid inputs.
- **Edge cases**: empty values, `None`, zero, negatives, boundaries (min/max, off-by-one), single-element collections, duplicates, unicode/whitespace, large inputs.
- **Error cases**: invalid inputs, expected exceptions.

Do not invent cases that make no sense for the function.

## 7. Unit-level, short, explicit

- One behaviour per test, one `# when` call, few assertions.
- Mock external dependencies (I/O, network, DB, clock) so tests stay unit-level; use `pytest` fixtures, `tmp_path`, `monkeypatch`, or `unittest.mock`.
- No logic (loops, conditionals) in tests. Use `@pytest.mark.parametrize` only for truly same-shaped cases; otherwise write separate tests with explicit names.
- Names and literal values should make the intent obvious without a docstring.

## Workflow

1. Read the target module; list public functions/classes and their branches.
2. Check for an existing `tests/` folder and existing tests; match conventions, don't duplicate.
3. Decide single file vs. sub-folder (rule 2).
4. Write tests following rules 3–7.
5. Run `pytest` on the new tests if possible and fix failures (a failing test may reveal a real bug: report it rather than bending the test).
6. Summarize: files created, number of tests, notable cases covered, anything skipped.

---
tags: ['react', 'javascript', 'accessibility', 'beginner', 'ariakit']
image: './08-ariakit-examples-and-docs/ariakit-logo.png'
---

# Покращення для бібліотеки Ariakit

**Складність: легка**

Нещодавно пройшла конференція [React+ fwdays’25](https://fwdays.com/en/event/react-fwdays-2025) на якій [Aurora Scharff](https://github.com/aurorascharff) доповідала про ствроння асинхронних інтерфейсів за допомогою `Ariakit`. 

[Ariakit](https://ariakit.org/) — це бібліотека низькорівневих **доступних** компонентів для `React`, і так, там є відкриті задачі, які нам підійдуть.

**[Issue #1651: Composite item is not marked as disabled passing accessibleWhenDisabled](https://github.com/ariakit/ariakit/issues/1651)**

Все почалось, з питання, що щось властивість `accessibleWhenDisabled` працює неправильно, проте виявилось, що треба лише додати невеличкий `JSDoc` коментар. **Уважно прочитайте обговорення, щоб правильно зробити**. Не зважайте на її назву, там все як я описав.

**[Issue #939: Examples](https://github.com/ariakit/ariakit/issues/939)**

Це навіть не одна задача, а кілька - бо це список прикладів використання компонентів, яких не вистачає. **Механіка виконання як я люблю: просто береш будь-що зі списку і робиш**. Хто перший той і контріб'ютор. І так, я перевірив, багато задач зі списку, ще не зроблені в коді.
+++
title= "Constructor Options in Go"
description= "A simple way to hook in optional setup for a type, while providing defaults."
date= "2017-10-27"
highlight= "true"
+++

I started coding full-time in [Go](https://golang.org) about six months ago. In that time, I've picked up various ideas and idioms by looking at the code of my peers, and of the various open source projects we use. I've been wanting to write up some of those ideas, mostly to solidify them in my own mind, but also in case these descriptions could be useful to anyone else.

The first pattern I want to cover is the _Options pattern_, a handy way of adding optional setup for a type, while still being able to provide defaults. Let's start with an example. I'm quite bad for making jokes about troubling events too soon after they've happened, so I'm going to have an object that checks if it's appropriate for me to make a joke yet.

```go
package main

import (
	"fmt"
	"time"
)

// Moratorium tells me if it's too soon to tell a joke after an event.
type Moratorium struct {
	event    time.Time
	duration time.Duration
}

// TooSoon indicates if it's too soon to crack a joke.
func (m *Moratorium) TooSoon() bool {
	return m.event.Add(m.duration).After(time.Now())
}

// NewMoratorium returns a new Moratorium.
func NewMoratorium(event time.Time, duration time.Duration) *Moratorium {
	return &Moratorium{
		event:    event,
		duration: duration,
	}
}

func main() {
	when, _ := time.Parse(time.RFC3339, "2017-10-02T18:04:05Z07:00")
	howLong := time.Hour * 24 * 30
	catDied := NewMoratorium(when, howLong)

	if catDied.TooSoon() {
		fmt.Println("Too soon.")
	} else {
		fmt.Println("Go for it.")
	}
}	
```

Now, this works well enough, but unit testing it is a PITA. If I want to check a range of different events and durations, I need to do a load of date arithmetic to make the dates relative to the current time. e.g.:

```go
func TestIsTooSoon(t *testing.T) {
	now := time.Now()
	past := now.Add(-1 * time.Hour)
	diff := 59 * time.Minute

	sut := NewMoratorium(past, diff)

	if sut.TooSoon() {
		t.Fatal("Too soon")
	}
}
```

It would be far better if we could hold time constant, and take the date logic out of our tests. To do that, let's inject a clock into our `Moratorium`.

```go
type Moratorium struct {
	now      func() time.Time
	event    time.Time
	duration time.Duration
}
```

Now, instead of calling `time.Now()` in our `TooSoon()` method, we'll call `m.now()`:

```go
func (m *Moratorium) TooSoon() bool {
	return m.event.Add(m.duration).After(m.now())
}
```

OK, all neat and tidy so far. To inject the `now` func into the struct, we could make the struct field public, but that feels a bit icky for reasons of encapsulation. Let's pass it into the constructor:

```go
func NewMoratorium(event time.Time, duration time.Duration, now func() time.Time) *Moratorium {
	return &Moratorium{
		now:      now,
		event:    event,
		duration: duration,
	}
}
```

My problem with this is that it's going to be given `time.Time` pretty much everywhere other than in tests. I'd rather the `now` field defaulted to `time.Time`, but we could _optionally_ set a `now` func (see where I'm going with this?). Let's define a type for an optional constructor argument:

```go
type Option func(*Moratorium)
```

Now we'll define a function that sets a given `now` func on the `Moratorium`, and handle that in the constructor:

```go
func NowFunc(now func() time.Time) Option {
	return func(m *Moratorium) {
		m.now = now
	}
}

func NewMoratorium(event time.Time, duration time.Duration, options ...Option) *Moratorium {
	m := &Moratorium{
		now:      time.Now,
		event:    event,
		duration: duration,
	}
	for _, o := range options {
		o(m)
	}
	return m
}
```

Now we can pass zero or more options to the constructor, as needed. These also have the nice property that, by defining `NowFunc()` in the same package as the `Moratorium` type, it can access the private fields of the struct, so we can keep the struct fields hidden.

Now that we have a way to inject the current time, we can re-write our test:

```go
func TestIsTooSoon(t *testing.T) {
	start, _ := time.Parse(time.Kitchen, "4:00PM")

	var now time.Time
	clock := func() time.Time { return now }
	sut := NewMoratorium(start, time.Hour, NowFunc(clock))

	cases := []struct {
		now  string
		want bool
	}{
		{"4:00PM", true},
		{"4:59PM", true},
		{"5:00PM", false},
	}

	for k, c := range cases {
		now, _ = time.Parse(time.Kitchen, c.now)
		got := sut.TooSoon()

		if got != c.want {
			t.Fatalf("case %d: want=%t, got=%t", k, c.want, got)
		}
	}
}
```
Both the option functions and the nowFunc are examples of functions as values, which looked odd to me at first, but it's a pretty clean way of doing things. I've seen alternatives to the nowFunc where an interface is declared with a `Now()` method, which then has to be implemeted by an object that just passes the call on to `time.Now()`. While that seemed perfectly natural to me at first, once I'd seen the way functions could be passed as values, I much preferred the latter.

I've found this really handy for injecting any kind of small strategy object. Things like error handlers in an HTTP server, logger settings, and other non-essential items that have sensible defaults, and would otherwise clutter up the constructor. 

It would also be perfectly valid to use a setter here. The reason I prefer the option pattern for this sort of thing is that it allows us to ensure that the object is completely ready to go when its constructor returns, and that these fields are only set when the object is built. If you've got a setter that shouldn't be called more than once, it might be worth turning it into a constructor option.

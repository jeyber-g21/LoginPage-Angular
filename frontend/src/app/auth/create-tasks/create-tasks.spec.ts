import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTasks } from './create-tasks';

describe('CreateTasks', () => {
  let component: CreateTasks;
  let fixture: ComponentFixture<CreateTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

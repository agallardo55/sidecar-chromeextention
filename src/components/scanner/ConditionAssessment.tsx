import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wrench } from 'lucide-react';

interface ConditionCategory {
  id: string;
  label: string;
  rating: number; // 1-5 rating
}

const defaultCategories: ConditionCategory[] = [
  { id: 'exterior', label: 'Exterior', rating: 5 },
  { id: 'interior', label: 'Interior', rating: 5 },
  { id: 'engine', label: 'Engine', rating: 5 },
  { id: 'electronics', label: 'Electronics', rating: 5 },
];

export const ConditionAssessment = () => {
  const [categories, setCategories] = useState<ConditionCategory[]>(defaultCategories);
  const [customNotes, setCustomNotes] = useState('');

  const updateRating = (categoryId: string, rating: number) => {
    setCategories(prev => prev.map(category => 
      category.id === categoryId ? { ...category, rating } : category
    ));
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
      case 2: return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500';
      case 3: return 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500';
      case 4: return 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500';
      case 5: return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
      default: return 'bg-muted hover:bg-muted/80 text-muted-foreground border-muted';
    }
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-primary" />
          <span>Condition Assessment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                {category.label}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {getRatingLabel(category.rating)}
                </span>
                <Badge className={getRatingColor(category.rating)}>
                  {category.rating}/5
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-1 md:gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => updateRating(category.id, rating)}
                  className={`
                    flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all border
                    ${category.rating === rating 
                      ? getRatingColor(rating)
                      : 'bg-muted/30 hover:bg-muted/50 text-muted-foreground border-muted/30'
                    }
                  `}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div className="space-y-2">
          <Label htmlFor="custom-notes">Additional Notes</Label>
          <Textarea
            id="custom-notes"
            placeholder="Describe any specific condition issues or notable features..."
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};